import Dali from './../main';
import {ID_PREFIX_SECTION} from './../../constants';

export default {
    createimsManifest: function (title, sections) {
        var doc = document.implementation.createDocument("", "", null);

        ///     ROOT MANIFEST
        var manifest = doc.createElement("manifest");
        manifest.setAttribute("xmlns", "http://www.imsproject.org/xsd/imscp_rootv1p1p2");
        manifest.setAttribute("xmlns:adlcp", "http://www.adlnet.org/xsd/adlcp_rootv1p2");
        manifest.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        manifest.setAttribute("identifier", "com.dali.presentation");
        manifest.setAttribute("version", "1.0");
        manifest.setAttribute("xsi:schemaLocation", "http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd");

        ///      METADATA
        var metadata = doc.createElement("metadata");
        var schema = doc.createElement("schema");
        var schema_txt = doc.createTextNode("ADL SCORM");
        schema.appendChild(schema_txt);
        metadata.appendChild(schema);

        var schemaVersion = doc.createElement("schemaversion");
        var schema_version_txt = doc.createTextNode("1.2");
        schemaVersion.appendChild(schema_version_txt);
        metadata.appendChild(schemaVersion);


        ///       ORGANIZATION (USED DEFAULT)
        var organizations = doc.createElement("organizations");
        organizations.setAttribute("default", "defaultOrganization");
        var organization = doc.createElement("organization");
        organization.setAttribute("identifier", "defaultOrganization");

        //        ORGANIZATION _TITLE
        var title_org = doc.createElement("title");
        var title_item_txt = doc.createTextNode(title);
        title_org.appendChild(title_item_txt);
        organization.appendChild(title_org);

        // Create Organization Item Tree
        var root_elements = sections[0].children;
        // Resource XLM elements array
        var resource_elements = [];

        //        ORGANIZATION_ITEMS
        for (let n = 0; n < root_elements.length; n ++ ){
            let root_section = root_elements[n];
            let children_elements = [];

            let root_element = doc.createElement("item");

            root_element.setAttribute("identifier", this.santinize_id(root_section) + "_item");
            if (Dali.Config.sections_have_content || root_section.indexOf(ID_PREFIX_SECTION) === -1){
                 root_element.setAttribute("identifierref", this.santinize_id(sections[root_section].id) + "_resource");
            }

            let root_element_title = doc.createElement("title");
            let root_element_text = doc.createTextNode(sections[root_section].unitNumber +". "+ sections[root_section].name);
            root_element_title.appendChild(root_element_text);
            root_element.appendChild(root_element_title);

            let sections_copy = JSON.parse(JSON.stringify(sections));
            children_elements = sections_copy[root_section].children;

            //Added root element for resource iteration
            resource_elements.push({
                path: "unit"+ sections[root_section].unitNumber + "/" + this.santinize_id(sections[root_section].id)+".html",
                id: sections[root_section].id
            });

            //Unit children Tree
            while (children_elements.length !== 0){
                let actual_child = children_elements.shift();
                let branch = this.xmlOrganizationBranch(actual_child, actual_child, sections_copy, doc, resource_elements);
                root_element.appendChild(branch);
        }
            //end children Tree
            organization.appendChild(root_element);
        }
        //end of Organization Item Tree

        organizations.appendChild(organization);

        ///   RESOURCE ITEMS
        var resources = doc.createElement("resources");
            for (var i = 0; i < resource_elements.length; i++) {
            if ( !Dali.Config.sections_have_content && (resource_elements[i].id.indexOf(ID_PREFIX_SECTION) !== -1)){
                continue;
            }
            var resource = doc.createElement("resource");
            resource.setAttribute("identifier", this.santinize_id(resource_elements[i].id) + "_resource");
            resource.setAttribute("type", "webcontent");
            resource.setAttribute("adlcp:scormtype", "sco");
            resource.setAttribute("href", resource_elements[i].path);

            var file = doc.createElement("file");
            file.setAttribute("href", resource_elements[i].path);
            resource.appendChild(file);

            resources.appendChild(resource);
            // End of pieze of code to iterate
        }

        // Common DATA


        /// APPEND DATA
        manifest.appendChild(metadata);
        manifest.appendChild(organizations);
        manifest.appendChild(resources);

        doc.appendChild(manifest);

        return (this.beautifyXML(new XMLSerializer().serializeToString(doc)));
    },

    getIndex: function (navs) {
        return (new EJS({url: Dali.Config.scorm_ejs}).render({navs: navs}));
    },
    xmlOrganizationBranch: function(root_child, actual_child, sections, doc, resource_elements){
        let branch_elements = [];
        if(sections[actual_child].children.length !== 0){
            while(sections[actual_child].children.length > 0){
                let iteration_child = sections[actual_child].children.shift();
                if(iteration_child.indexOf(ID_PREFIX_SECTION) !== -1){
                    branch_elements.push(this.xmlOrganizationBranch(root_child,iteration_child, sections, doc,resource_elements));
                } else{

                    let actual_section =  iteration_child;

                    let element = doc.createElement("item");
                    element.setAttribute("identifier", this.santinize_id(sections[actual_section].id) + "_item");
                    element.setAttribute("identifierref", this.santinize_id(sections[actual_section].id) + "_resource");
                    let element_title = doc.createElement("title");
                    let element_text = doc.createTextNode(sections[actual_section].name);
                    element_title.appendChild(element_text);
                    element.appendChild(element_title);
                    
                    resource_elements.push({
                            path: "unit"+ sections[actual_section].unitNumber + "/" + this.santinize_id(sections[actual_section].id)+".html",
                            id: sections[actual_section].id
                        });
                    

                    branch_elements.push(element);

                }
            }
        }

        let actual_section = actual_child;
        
        let element = doc.createElement("item");
        element.setAttribute("identifier", this.santinize_id(sections[actual_section].id) + "_item");
        if ( Dali.Config.sections_have_content || (sections[actual_section].id.indexOf(ID_PREFIX_SECTION) === -1)){
            element.setAttribute("identifierref", this.santinize_id(sections[actual_section].id) + "_resource");
        }
        let element_title = doc.createElement("title");
        let element_text = doc.createTextNode(sections[actual_section].name);
        element_title.appendChild(element_text);

        element.appendChild(element_title);

        resource_elements.push({
                path: "unit"+ sections[actual_section].unitNumber + "/" + this.santinize_id(sections[actual_section].id)+".html",
                id: sections[actual_section].id
            });

        if(branch_elements.length !== 0){
            for(let n = 0; n < branch_elements.length; n++){
                element.appendChild(branch_elements[n]);
            }
        }

        return element;
    },
    beautifyXML:  function (xml) {
        var reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
        var wsexp = / *(.*) +\n/g;
        var contexp = /(<.+>)(.+\n)/g;
        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
        var pad = 0;
        var formatted = '';
        var lines = xml.split('\n');
        var indent = 0;
        var lastType = 'other';
        // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
        var transitions = {
            'single->single': 0,
            'single->closing': -1,
            'single->opening': 0,
            'single->other': 0,
            'closing->single': 0,
            'closing->closing': -1,
            'closing->opening': 0,
            'closing->other': 0,
            'opening->single': 1,
            'opening->closing': 0,
            'opening->opening': 1,
            'opening->other': 1,
            'other->single': 0,
            'other->closing': -1,
            'other->opening': 0,
            'other->other': 0
        };

        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i];
            var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
            var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
            var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
            var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            var fromTo = lastType + '->' + type;
            lastType = type;
            var padding = '';

            indent += transitions[fromTo];
            for (var j = 0; j < indent; j++) {
                padding += '\t';
            }
            if (fromTo === 'opening->closing') {
                formatted = formatted.substr(0, formatted.length - 1) + ln + '\n'; // substr removes line break (\n) from prev loop
            }
            else {
                formatted += padding + ln + '\n';
            }
    }

        return formatted;
    },
    santinize_id: function(str){
        return str.replace(/\-/g,"\_");
    }
};
