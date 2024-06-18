

export const biteToKilobite = (bite) => {
  if(bite < 1048576) return `${parseInt(bite / 1024)} KB`;

  return `${parseInt(bite / 1048576)} MB`;
}