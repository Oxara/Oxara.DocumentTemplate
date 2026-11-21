// Brand owns typed token resolution; DT verifies its exact web consumer binding.
export function validateBrandWebTheme(manifest, profile, resolved) {
 const roles={primaryBackground:'background',primaryHover:'hover',primaryForeground:'foreground'};
 const theme=manifest.consumerTheme;
 for(const [field,role] of Object.entries(roles)) {
  if(profile.consumerTheme?.[field]!=='webAction.primary.'+role)throw Error('Expected typed web action binding: '+field);
  if(!/^#[0-9A-F]{6}$/.test(theme?.[field]||'')||theme[field]!==resolved.values[role])throw Error('Web action export differs from resolved source: '+field);
 }
 if(theme.brand!==theme.primaryBackground||theme.primaryForeground!==theme.neutralInk)throw Error('DT web actions require identity background and Ink foreground.');
 if(!Array.isArray(manifest.contrastExceptions)||manifest.contrastExceptions.length)throw Error('DT web actions do not inherit legacy white contrast exceptions.');
 const lum=hex=>hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
 const primaryContrast=ratio(theme.primaryBackground,theme.primaryForeground),hoverContrast=ratio(theme.primaryHover,theme.primaryForeground);
 if(Math.min(primaryContrast,hoverContrast)<4.5)throw Error('DT web action normal/hover text contrast must meet4.5:1.');
 return {primaryContrast,hoverContrast};
}
