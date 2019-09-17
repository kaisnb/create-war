#! /usr/bin/env node

const fs = require('fs');
const archiver = require('archiver');

// parsing cli arguments. need to skip the first two.
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const splitted = process.argv[i].split("=");
  args[splitted[0]] = splitted[1];
}

// reading config file at the given path
console.log('Reading config file at ' + args.config);
const configFile = fs.readFileSync(args.config);
const CONF = JSON.parse(configFile);

// create an output stream for our war and an archive
console.log('Create output stream for war at ' + CONF.OUT_PATH);
const output = fs.createWriteStream(CONF.OUT_PATH);
const archive = archiver('zip', {});

// log some message when the war creation is finished
output.on('finish', () => {
  console.log('Created war (' + CONF.OUT_PATH + ') ' + archive.pointer() + ' total bytes');
});

// redirect the archive content to the output stream of our war
archive.pipe(output);

// add the given directory to the war
console.log('Add directory ' + CONF.INPUT_PATH + ' to the war');
archive.directory(CONF.INPUT_PATH, '/');

// create web.xml file which is required
console.log('Add web.xml file with display-name ' + CONF.DISPLAY_NAME);
archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://xmlns.jcp.org/xml/ns/javaee"
	xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
	version="3.1">
	<display-name>` + CONF.DISPLAY_NAME + `</display-name>
	<welcome-file-list>
		<welcome-file>index.html</welcome-file>
	</welcome-file-list>
</web-app>`, { name: 'WEB-INF/web.xml' });

// create jboss-web.xml to override context-root
console.log('Add jboss-web.xml file with context-root ' + CONF.CONTEXT_ROOT);
archive.append(`<?xml version="1.0" encoding="UTF-8"?>
<jboss-web xmlns="http://www.jboss.com/xml/ns/javaee"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   xsi:schemaLocation="
      http://www.jboss.com/xml/ns/javaee
      http://www.jboss.org/j2ee/schema/jboss-web_5_1.xsd">
   <context-root>` + CONF.CONTEXT_ROOT + `</context-root>
</jboss-web>`, { name: 'WEB-INF/jboss-web.xml' });

// adding rewrite rules because we are a SPA
console.log('Creating undertow-handlers.conf to rewrite alle routes to index.html');
archive.append(`exists(true) -> done
path-prefix('/') -> rewrite('/')
`, { name: 'WEB-INF/undertow-handlers.conf' });

// close the zip
archive.finalize();