import { ContextProvider } from "aws-cdk-lib";
import { IpRangesContextQuery, IpRangesContextResponse } from "./plugins/aws-ip-ranges/aws-ip-ranges-context-provider";
import { Construct } from "constructs";

export class IpRanges {
  public readonly ipv4Ranges: string[];
  public readonly ipv6Ranges: string[];
  
  constructor(scope: Construct, service: string, region: string) {
    const response: IpRangesContextResponse = ContextProvider.getValue(scope, {
          provider: "TBD",
          props: {
            service,
          } satisfies IpRangesContextQuery,
      dummyValue: {} satisfies IpRangesContextResponse,
    }).value;
    
    this.ipv4Ranges = response[region]?.ipv4Ranges ?? [];
    this.ipv6Ranges = response[region]?.ipv6Ranges ?? [];
  }
}
