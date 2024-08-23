import Aurora from './Aurora';
import {
  AuroraPromiseError,
  AuroraInstanceError,
  AuroraClassError,
} from './errors';
import { AuroraCallOptions, AuroraHeaders, AuroraParams } from './types';

// Aurora Instance
const aurora = new Aurora();

export default aurora;
export { Aurora, AuroraPromiseError, AuroraInstanceError, AuroraClassError };
export type { AuroraHeaders, AuroraParams, AuroraCallOptions };
