import { IPluginHost, Plugin } from '@aws-cdk/cli-plugin-contract';
import { PluginHost } from '@aws-cdk/toolkit-lib';
import { IP_RANGES_PLUGIN, IpRangesContextProviderPlugin } from './aws-ip-ranges-context-provider';

/**
 * AWS CDK Plugin for registering an IP ranges context provider
 */
class IpRangesPlugin implements Plugin {
  public readonly version = '1';

  init(host: IPluginHost) {
    (host as PluginHost).registerContextProviderAlpha(
      IP_RANGES_PLUGIN,
      new IpRangesContextProviderPlugin(),
    );
  }
}

export = new IpRangesPlugin();
