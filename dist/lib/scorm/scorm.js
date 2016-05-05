

var DaliScorm = {


    exports: function(state){

        var today = new Date();
        var strDate = 'd-m-Y'
          .replace('d', today.getDate())
          .replace('m', today.getMonth()+1)
          .replace('Y', today.getFullYear());

        JSZipUtils.getBinaryContent('/lib/scorm/scorm.zip', function(err, data) {

            if(err) {
                throw err; // or handle err
            }

            var zip = new JSZip(data);
            var navs = state.present.navItemsById;
            var sections = [];
            state.present.navItemsIds.map(page => {

                var inner = new EJS({url: '/lib/visor/index.ejs'}).render({
                 page: page,
                 navs: navs,
                 boxesById: state.present.boxesById,
                 boxes: state.present.boxes,
                 toolbarsById: state.present.toolbarsById,
                 strDate: strDate
                });

                var nombre = navs[page].name;
                sections.push(nombre);

                zip.file(nombre+".html", inner);
            });

            zip.file("imsmanifest.xml",DaliScorm.testXML("Título Curso", sections));



            var content = zip.generate({type:"blob"});
            saveAs(content, "scorm.zip");



        });



    } ,


    testXML: function(title, sections){
      var doc = document.implementation.createDocument("", "", null);

      ///     ROOT MANIFEST
      var manifest = doc.createElement("manifest");
      manifest.setAttribute("xmlns","http://www.imsproject.org/xsd/imscp_rootv1p1p2");
      manifest.setAttribute("xmlns:adlcp","http://www.adlnet.org/xsd/adlcp_rootv1p2" );
      manifest.setAttribute("xmlns:xsi","http://www.w3.org/2001/XMLSchema-instance");
      manifest.setAttribute("identifier", "com.dali.presentation");
      manifest.setAttribute("version","1.0");
      manifest.setAttribute("xsi:schemaLocation", "http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd");

      ///      METADATA
      var metadata = doc.createElement("metadata");
      var schema = doc.createElement("schema");
      schema_txt = doc.createTextNode("ADL SCORM");
      schema.appendChild(schema_txt);
      metadata.appendChild(schema);

      var schemaVersion = doc.createElement("schemaversion");
      schema_version_txt = doc.createTextNode("1.2");
      schemaVersion.appendChild(schema_version_txt);
      metadata.appendChild(schemaVersion);


      ///       ORGANIZATION
      var organizations = doc.createElement("organizations");
      organizations.setAttribute("default","defaultOrganization");

      var organization = doc.createElement("organization");
      organization.setAttribute("identifier","defaultOrganization");


      var title_org = doc.createElement("title");
      title_item_txt = doc.createTextNode(title);
      title_org.appendChild(title_item_txt);  //TODO: Include Title

      var item_org = doc.createElement("item");
      item_org.setAttribute("identifier", "item1");
      item_org.setAttribute("identifierref","resource1");

      var title_item = doc.createElement("item");
      title_item_txt = doc.createTextNode("Default Title");
      title_item.appendChild(title_item_txt); //TODO: Include title identifier

      item_org.appendChild(title_item);

      organization.appendChild(title_org);
      organization.appendChild(item_org);

      organizations.appendChild(organization);



      ///   RESOURCES
      var resources = doc.createElement("resources");
      for(var i = 0; i< sections.length; i++){
        //TODO: Iterate over html elements and add this pieze of code
        var resource = doc.createElement("resource");
        resource.setAttribute("identifier", "resource"+(i+1));
        resource.setAttribute("type", "webcontent");
        resource.setAttribute("adlcp:scormtype", "sco");
        resource.setAttribute("href", sections[i]+".html");

        var file = doc.createElement("file");
        file.setAttribute("href", sections[i]+".html");
        resource.appendChild(file);

        resources.appendChild(resource);
        // End of pieze of code to iterate
      }

      /// APPEND DATA
      manifest.appendChild(metadata);
      manifest.appendChild(organizations);
      manifest.appendChild(resources);

      doc.appendChild(manifest);

      return new XMLSerializer().serializeToString(doc)
    }


}
