import { ContextProviderPlugin } from '@aws-cdk/toolkit-lib';
import * as https from 'https';

const IP_RANGES_URL = 'https://ip-ranges.amazonaws.com/ip-ranges.json';
export const IP_RANGES_PLUGIN = "aws-ip-ranges";

/**
 * Query for looking up AWS service IP ranges
 */
export interface IpRangesContextQuery {
  /**
   * AWS service name (e.g., 'AURORA_DSQL', 'EC2', 'S3')
   */
  readonly service: string;
}

/**
 * IP ranges for a specific region
 */
export interface IpRanges {
  readonly ipv4Ranges: string[];
  readonly ipv6Ranges: string[];
}

/**
 * Response containing IP ranges by region
 */
export interface IpRangesContextResponse {
  [region: string]: IpRanges;
}

/**
 * Raw IP ranges data structure from AWS
 */
interface AwsIpRangesData {
  syncToken: string;
  createDate: string;
  prefixes: Array<{
    ip_prefix: string;
    region: string;
    service: string;
    network_border_group: string;
  }>;
  ipv6_prefixes: Array<{
    ipv6_prefix: string;
    region: string;
    service: string;
    network_border_group: string;
  }>;
}

/**
 * Context provider plugin for AWS IP ranges
 */
export class IpRangesContextProviderPlugin implements ContextProviderPlugin{
  public async getValue(args: IpRangesContextQuery): Promise<IpRangesContextResponse> {
    const data = await this.fetchIpRanges();
    const service = args.service.toUpperCase();

    const result: IpRangesContextResponse = {};

    // Process IPv4 ranges
    for (const prefix of data.prefixes) {
      if (prefix.service === service) {
        if (!result[prefix.region]) {
          result[prefix.region] = { ipv4Ranges: [], ipv6Ranges: [] };
        }
        result[prefix.region].ipv4Ranges.push(prefix.ip_prefix);
      }
    }

    // Process IPv6 ranges
    for (const prefix of data.ipv6_prefixes) {
      if (prefix.service === service) {
        if (!result[prefix.region]) {
          result[prefix.region] = { ipv4Ranges: [], ipv6Ranges: [] };
        }
        result[prefix.region].ipv6Ranges.push(prefix.ipv6_prefix);
      }
    }

    return result;
  }

  private async fetchIpRanges(): Promise<AwsIpRangesData> {
    return new Promise((resolve, reject) => {
      https
        .get(IP_RANGES_URL, (res) => {
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to fetch IP ranges: HTTP ${res.statusCode}`));
            return;
          }

          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              const parsed = JSON.parse(data) as AwsIpRangesData;
              resolve(parsed);
            } catch (err: any) {
              reject(new Error(`Failed to parse IP ranges: ${err.message}`));
            }
          });
        })
        .on('error', (err) => {
          reject(new Error(`Failed to fetch IP ranges: ${err.message}`));
        });
    });
  }
}
