/** @type {import('@remotion/cli/config').Config} */
import { Config } from '@remotion/cli/config';
import { enableTailwind } from '@remotion/tailwind';

Config.overrideWebpackConfig((currentConfiguration) => {
    return enableTailwind(currentConfiguration);
});
