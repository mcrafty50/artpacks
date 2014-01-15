// Generated by CoffeeScript 1.6.3
(function() {
  var AdmZip, getNamespaces_RP, nameToPath_RP, path, readResourcePack, results, zip;

  AdmZip = require('adm-zip');

  path = require('path');

  readResourcePack = function(zip, names) {
    var data, found, name, namespace, namespaces, pathRP, results, tryPath, tryPaths, zipEntries, zipEntry, _i, _j, _len, _len1;
    results = {};
    namespaces = getNamespaces_RP(zip);
    namespaces.push('foo');
    zipEntries = zip.getEntries();
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      pathRP = nameToPath_RP(name);
      found = false;
      if (pathRP.indexOf('*') === -1) {
        tryPaths = [pathRP];
      } else {
        tryPaths = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = namespaces.length; _j < _len1; _j++) {
            namespace = namespaces[_j];
            _results.push(pathRP.replace('*', namespace));
          }
          return _results;
        })();
      }
      for (_j = 0, _len1 = tryPaths.length; _j < _len1; _j++) {
        tryPath = tryPaths[_j];
        zipEntry = zip.getEntry(tryPath);
        if (zipEntry != null) {
          console.log('FOUND', pathRP, 'AT', zipEntry.entryName);
          data = zipEntry.getData();
          console.log("decompressed " + zipEntry.entryName + " to " + data.length);
          results[name] = data;
          found = true;
          break;
        }
      }
      if (!found) {
        console.log("ERROR: couldn't find " + pathRP + " anywhere in zip! (tried " + tryPaths + ")");
        results[name] = null;
      }
    }
    return results;
  };

  nameToPath_RP = function(name) {
    var a, category, ext, namespace, pathRP, _ref;
    a = name.split('/');
    if (a.length > 1) {
      category = a[0], name = a[1];
    }
    category = (_ref = {
      undefined: 'blocks',
      'i': 'items'
    }[category]) != null ? _ref : category;
    a = name.split(':');
    if (a.length > 1) {
      namespace = a[0], name = a[1];
    }
    if (namespace == null) {
      namespace = '*';
    }
    ext = '.png';
    pathRP = "assets/" + namespace + "/textures/" + category + "/" + name + ".png";
    return pathRP;
  };

  getNamespaces_RP = function(zip) {
    var namespaces, parts, zipEntries, zipEntry, _i, _len;
    zipEntries = zip.getEntries();
    namespaces = {};
    for (_i = 0, _len = zipEntries.length; _i < _len; _i++) {
      zipEntry = zipEntries[_i];
      parts = zipEntry.entryName.split(path.sep);
      if (parts.length < 2) {
        continue;
      }
      if (parts[0] !== 'assets') {
        continue;
      }
      if (parts[1].length === 0) {
        continue;
      }
      namespaces[parts[1]] = true;
    }
    return Object.keys(namespaces);
  };

  console.log(nameToPath_RP('dirt'));

  console.log(nameToPath_RP('i/stick'));

  console.log(nameToPath_RP('misc/shadow'));

  console.log(nameToPath_RP('minecraft:dirt'));

  console.log(nameToPath_RP('somethingelse:dirt'));

  zip = new AdmZip('test.zip');

  results = readResourcePack(zip, ['dirt', 'i/stick', 'misc/shadow', 'minecraft:dirt', 'somethingelse:dirt', 'invalid']);

  console.log('results=', results);

}).call(this);
