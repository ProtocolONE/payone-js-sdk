import { apiUrl, formUrl } from './constants';

export default function getFunctionalUrls({ customApiUrl, customFormUrl }) {
  return {
    apiUrl: customApiUrl || apiUrl,
    formUrl: customFormUrl || formUrl,
  };
}
