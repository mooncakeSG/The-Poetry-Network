const fs = require('fs');
const path = require('path');

function findDynamicRoutes(dir) {
  const routes = [];
  
  function scan(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (file.match(/\[.*\]/)) {
        routes.push(fullPath);
      }
    });
  }
  
  scan(dir);
  return routes;
}

// Check app directory
const appRoutes = findDynamicRoutes(path.join(process.cwd(), 'app'));
console.log('\nDynamic routes in app directory:');
appRoutes.forEach(route => console.log(route));

// Check pages directory if it exists
const pagesDir = path.join(process.cwd(), 'pages');
if (fs.existsSync(pagesDir)) {
  const pagesRoutes = findDynamicRoutes(pagesDir);
  console.log('\nDynamic routes in pages directory:');
  pagesRoutes.forEach(route => console.log(route));
}

// Check for potential conflicts
const allRoutes = [...appRoutes];
const conflicts = [];

allRoutes.forEach((route, i) => {
  const routeName = path.basename(route, path.extname(route));
  const routeDir = path.dirname(route);
  
  allRoutes.forEach((otherRoute, j) => {
    if (i !== j) {
      const otherRouteName = path.basename(otherRoute, path.extname(otherRoute));
      const otherRouteDir = path.dirname(otherRoute);
      
      if (routeDir === otherRouteDir && 
          routeName.replace(/\[.*\]/, '') === otherRouteName.replace(/\[.*\]/, '')) {
        conflicts.push([route, otherRoute]);
      }
    }
  });
});

if (conflicts.length > 0) {
  console.log('\nPotential route conflicts found:');
  conflicts.forEach(([route1, route2]) => {
    console.log(`\nConflict between:`);
    console.log(`  ${route1}`);
    console.log(`  ${route2}`);
  });
} else {
  console.log('\nNo route conflicts found!');
} 