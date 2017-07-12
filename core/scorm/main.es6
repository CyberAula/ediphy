import Dali from './../main';
import {ID_PREFIX_SECTION} from './../../constants';
import {isSection} from './../../utils';
export default {
    createSPAimsManifest : function(navsIds, sections, globalConfig) {
        var doc = document.implementation.createDocument("", "", null);

        ///     ROOT MANIFEST
        var manifest = doc.createElement("manifest");
        manifest.setAttribute("identifier", "com.dali.presentation");
        manifest.setAttribute("version", "1.0");
        manifest.setAttribute("xmlns", "http://www.imsglobal.org/xsd/imscp_v1p1");
        manifest.setAttribute("xmlns:adlcp", "http://www.adlnet.org/xsd/adlcp_v1p3");
        manifest.setAttribute("xmlns:adlseq", "http://www.adlnet.org/xsd/adlseq_v1p3");
        manifest.setAttribute("xmlns:adlnav", "http://www.adlnet.org/xsd/adlnav_v1p3");
        manifest.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        manifest.setAttribute("xmlns:imsss", "http://www.imsglobal.org/xsd/imsss");
        manifest.setAttribute("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd");         
        
        ///      METADATA
        var metadata = doc.createElement("metadata");
        var schema = doc.createElement("schema");
        var schema_txt = doc.createTextNode("ADL SCORM");
        schema.appendChild(schema_txt);
        metadata.appendChild(schema);
        var schemaVersion = doc.createElement("schemaversion");
        var schema_version_txt = doc.createTextNode("2004 3rd Edition");
        schemaVersion.appendChild(schema_version_txt);
        metadata.appendChild(schemaVersion);
        metadata = this.lomCreator(globalConfig, doc, metadata);

        ///       ORGANIZATION (USED DEFAULT)
        var organizations = this.organizationsCreator(globalConfig, navsIds, sections, doc);
        

        ///   RESOURCE ITEMS
        var resources = doc.createElement("resources");
        var resource = doc.createElement("resource");
        resource.setAttribute("identifier", "resource_1");
        resource.setAttribute("type", "webcontent");
        resource.setAttribute("adlcp:scormType", "sco");
        resource.setAttribute("href", "dist/index.html");
        var file = doc.createElement("file");
        file.setAttribute("href", "dist/index.html");
        resource.appendChild(file);
        resources.appendChild(resource);


        // Common DATA


        /// APPEND DATA
        manifest.appendChild(metadata);
        manifest.appendChild(organizations);
        manifest.appendChild(resources);

        doc.appendChild(manifest);

        return (this.beautifyXML(new XMLSerializer().serializeToString(doc)));
    },
    lomCreator: function(gc, doc, metadata) {
        var lom = doc.createElement('lom');
        lom.setAttribute('xmlns',"http://ltsc.ieee.org/xsd/LOM");
        lom.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
        lom.setAttribute('xsi:schemaLocation', "http://ltsc.ieee.org/xsd/LOM lom.xsd");
        //GENERAL
        var general = this.generalCreator(gc,doc);
        lom.appendChild(general);

        //CLASSIFICATION (not implemented)
        // var classification = doc.createElement('classification');
        // lom.appendChild(classification);

        //ANNOTATION
        var annotation = this.annotationCreator(gc, doc);
        lom.appendChild(annotation);

        //LIFE CYCLE
        var lifeCycle = this.lifeCycleCreator(gc, doc);     
        lom.appendChild(lifeCycle);

        //TECHNICAL
        var technical = this.technicalCreator(gc, doc);
        lom.appendChild(technical);
        
        //METAMETADATA
        var metaMetadata = this.metaMetadataCreator(gc, doc);
        lom.appendChild(metaMetadata);

        //EDUCATIONAL
        var educational = this.educationalCreator(gc, doc);
        lom.appendChild(educational);
        
        //RELATION
        /*var relation = this.relationCreator(gc,doc);
        lom.appendChild(relation); */

        //RIGHTS
        var rights = this.rightsCreator(gc, doc);
        lom.appendChild(rights);

        metadata.appendChild(lom);
        return metadata;
    },
    generalCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var general = doc.createElement('general');
            var genId = doc.createElement('identifier'); // Identifier
                var genIdCatalog = doc.createElement('catalog');
                    var genIdCatalogTxt = doc.createTextNode("URI");
                    genIdCatalog.appendChild(genIdCatalogTxt);
                genId.appendChild(genIdCatalog);
                var genIdEntry = doc.createElement('entry');
                    var genIdEntryTxt = doc.createTextNode("http://vishub.org");//////////////////////////NOT IMPLEMENTED YET (Missing info from vish)
                    genIdEntry.appendChild(genIdEntryTxt);
                genId.appendChild(genIdEntry);
            general.appendChild(genId);
            var genTitle = doc.createElement('title'); // Title
                var genTitleString = doc.createElement('string');
                genTitleString.setAttribute('language', lang);
                    var genTitleStringTxt = doc.createTextNode(gc.title || '---');
                    genTitleString.appendChild(genTitleStringTxt);
                genTitle.appendChild(genTitleString);
            general.appendChild(genTitle);
            var genLang = doc.createElement('language'); // Language
                var genLangTxt = doc.createTextNode(lang);
                genLang.appendChild(genLangTxt);
            general.appendChild(genLang);
            var genDesc = doc.createElement('description'); // Description
                var genDescString = doc.createElement('string');
                genDescString.setAttribute('language', lang);
                    var genDescStringTxt = doc.createTextNode(gc.description || '...');
                    genDescString.appendChild(genDescStringTxt);
                genDesc.appendChild(genDescString);
            general.appendChild(genDesc);
            if (gc.keywords && gc.keywords.length > 0) { // Keywords
                for (var i = 0; i < gc.keywords.length; i++) {
                    var genKw = doc.createElement('keyword');
                        var genKwString = doc.createElement('string');
                        genKwString.setAttribute('language', lang);
                            var genKwStringTxt = doc.createTextNode(gc.keywords[i].text);
                            genKwString.appendChild(genKwStringTxt);
                        genKw.appendChild(genKwString);
                    general.appendChild(genKw);
                }
            }
            var genStruc = doc.createElement('structure'); // Structure
                var genStrucSource = doc.createElement('source');
                    var genStrucSourceTxt = doc.createTextNode('LOMv1.0');
                    genStrucSource.appendChild(genStrucSourceTxt);
                genStruc.appendChild(genStrucSource);
                var genStrucVal = doc.createElement('value');
                    var genStrucValTxt = doc.createTextNode('linear'); // DEFAULT
                    genStrucVal.appendChild(genStrucValTxt);
                genStruc.appendChild(genStrucVal);
            general.appendChild(genStruc);
            var genAggLevel = doc.createElement('aggregationLevel'); // Aggregation Level
                var genAggLevelSource = doc.createElement('source');
                    var genAggLevelSourceTxt = doc.createTextNode('LOMv1.0');
                    genAggLevelSource.appendChild(genAggLevelSourceTxt);
                genAggLevel.appendChild(genAggLevelSource);
                var genAggLVal = doc.createElement('value');
                    var genAggLValTxt = doc.createTextNode('3'); // DEFAULT
                    genAggLVal.appendChild(genAggLValTxt);
                genAggLevel.appendChild(genAggLVal);            
            general.appendChild(genAggLevel);
            return general;
    },
    annotationCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var annotation = doc.createElement('annotation');
            var annEntity = doc.createElement('entity'); // Entity
                var annEntTxt = doc.createTextNode('BEGIN:VCARD&amp;#xD;VERSION:3.0&amp;#xD;N:' + (gc.author || 'anonymous') + '&amp;#xD;FN:' + (gc.author || 'anonymous') + '&amp;#xD;END:VCARD');
                annEntity.appendChild(annEntTxt);
            annotation.appendChild(annEntity);
            var annDate = doc.createElement('date'); // Date
                var annDateTime = doc.createElement('dateTime');
                    var annDateTimeTxt = doc.createTextNode(date);
                    annDateTime.appendChild(annDateTimeTxt);
                annDate.appendChild(annDateTime);
                var annDateDesc = doc.createElement('description');
                    var annDateDescString = doc.createElement('string');
                    annDateDescString.setAttribute('language', 'en');
                        var annDateDescTxt = doc.createTextNode('This date represents the date the author finished authoring the metadata of the indicated version of the Learning Object.');
                        annDateDescString.appendChild(annDateDescTxt);
                    annDateDesc.appendChild(annDateDescString);
                annDate.appendChild(annDateDesc);
            annotation.appendChild(annDate);
        return annotation;
    },
    lifeCycleCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var lifeCycle = doc.createElement('lifeCycle');
            var lcv = doc.createElement('version');
                var lcvStr = doc.createElement('string');
                lcvStr.setAttribute('language', lang);
                    var lcvStrTxt = doc.createTextNode(gc.version);
                    lcvStr.appendChild(lcvStrTxt);
                lcv.appendChild(lcvStr);
            lifeCycle.appendChild(lcv);
            var lcs = doc.createElement('status');
                var lcss = doc.createElement('source');
                    var lcssTxt = doc.createTextNode("LOMv1.0");
                    lcss.appendChild(lcssTxt);
                lcs.appendChild(lcss);
                var lcsv = doc.createElement('value');
                    var lcsvTxt = doc.createTextNode(gc.status);
                    lcsv.appendChild(lcsvTxt);
                lcs.appendChild(lcsv);
            lifeCycle.appendChild(lcs); 
            var lcc = doc.createElement('contribute');
                var lccrole = doc.createElement('role');
                    var lccrolesource = doc.createElement('source');
                        var lccrolesourcetxt = doc.createTextNode('LOMv1.0');
                        lccrolesource.appendChild(lccrolesourcetxt);
                    lccrole.appendChild(lccrolesource);
                    var lccroleval = doc.createElement('value');
                        var lccrolevaltxt = doc.createTextNode('technical implementer');
                        lccroleval.appendChild(lccrolevaltxt);
                    lccrole.appendChild(lccroleval);
                lcc.appendChild(lccrole);
                var lccEntity = doc.createElement('entity'); // Entity
                    var lcEntTxt = doc.createTextNode('BEGIN:VCARD&#xD;VERSION:3.0&#xD;N:Authoring Tool Dali Editor (http://github.com/ging/DALI_EDITOR)&#xD;FN:Authoring Tool Dali Editor (http://github.com/ging/DALI_EDITOR)&#xD;END:VCARD'); /// Yet to determine
                    lccEntity.appendChild(lcEntTxt);
                lcc.appendChild(lccEntity);
                var lccDate = doc.createElement('date'); // Date
                    var lccDateTime = doc.createElement('dateTime');
                        var lccDateTimeTxt = doc.createTextNode(date);
                        lccDateTime.appendChild(lccDateTimeTxt);
                    lccDate.appendChild(lccDateTime);
                lcc.appendChild(lccDate);
            lifeCycle.appendChild(lcc);
            return lifeCycle;
    },
    technicalCreator: function(gc, doc) {
        var technical = doc.createElement('technical');
            var format = doc.createElement('format');
                var formatTxt = doc.createTextNode('text/html');
                format.appendChild(formatTxt);
            technical.appendChild(format);
            var location = doc.createElement('location');
                var locationTxt = doc.createTextNode('http://vishub.org/'); // Not yet implemented
                location.appendChild(locationTxt);
            technical.appendChild(location);
            var requirement = doc.createElement('requirement');
                var orComposite = doc.createElement('orComposite');
                    var orCType = doc.createElement('type');
                        var orCTSource = doc.createElement('source');
                            var orctsTxt = doc.createTextNode('LOMv1.0');
                            orCTSource.appendChild(orctsTxt);
                        orCType.appendChild(orCTSource);
                        var orCTValue = doc.createElement('value');
                            var orctvTxt = doc.createTextNode('browser');
                            orCTValue.appendChild(orctvTxt);
                        orCType.appendChild(orCTValue);
                    orComposite.appendChild(orCType);
                    var orCName = doc.createElement('name');
                        var orCNSource = doc.createElement('source');
                            var orcnsTxt = doc.createTextNode('LOMv1.0');
                            orCNSource.appendChild(orcnsTxt);
                        orCName.appendChild(orCNSource);
                        var orCNValue = doc.createElement('value');
                            var orcnvTxt = doc.createTextNode('browser');
                            orCNValue.appendChild(orcnvTxt);
                        orCName.appendChild(orCNValue);
                    orComposite.appendChild(orCName);
                requirement.appendChild(orComposite);
                // installationRemarks
                var otherPlatformReqs = doc.createElement('otherPlatformRequirements');
                    var oprStr = doc.createElement('string');
                    oprStr.setAttribute('language','en');
                        var oprStrTxt = doc.createTextNode('HTML5-compliant web browser');
                        oprStr.appendChild(oprStrTxt);
                    otherPlatformReqs.appendChild(oprStr);    
                requirement.appendChild(otherPlatformReqs);
            technical.appendChild(requirement);
        return technical;
    },
    metaMetadataCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var metaMetadata = doc.createElement('metaMetadata');
            // identifier data missing
            var mmc = doc.createElement('contribute');
                var mmcrole = doc.createElement('role');
                    var mmcrolesource = doc.createElement('source');
                        var mmcrolesourcetxt = doc.createTextNode('LOMv1.0');
                        mmcrolesource.appendChild(mmcrolesourcetxt);
                    mmcrole.appendChild(mmcrolesource);
                    var mmcroleval = doc.createElement('value');
                        var mmcrolevaltxt = doc.createTextNode('creator');
                        mmcroleval.appendChild(mmcrolevaltxt);
                    mmcrole.appendChild(mmcroleval);
                mmc.appendChild(mmcrole);
                var mmcEntity = doc.createElement('entity'); // Entity
                    var mmcEntTxt = doc.createTextNode('BEGIN:VCARD&amp;#xD;VERSION:3.0&amp;#xD;N:' + (gc.author || 'anonymous') + '&amp;#xD;FN:' + (gc.author || 'anonymous') + '&amp;#xD;END:VCARD');
                    mmcEntity.appendChild(mmcEntTxt);
                mmc.appendChild(mmcEntity);
                var mmcDate = doc.createElement('date'); // Date
                    var mmcDateTime = doc.createElement('dateTime');
                        var mmcDateTimeTxt = doc.createTextNode(date);
                        mmcDateTime.appendChild(mmcDateTimeTxt);
                    mmcDate.appendChild(mmcDateTime);
                    var mmcDateTimeDesc = doc.createElement('description');
                        var mmcDTDStr = doc.createElement('string');
                        mmcDTDStr.setAttribute('language', 'en');
                            var mmcDateTimeDescTxt = doc.createTextNode('This date represents the date the author finished authoring the metadata of the indicated version of the Learning Object');
                            mmcDTDStr.appendChild(mmcDateTimeDescTxt);
                        mmcDateTimeDesc.appendChild(mmcDTDStr);
                    mmcDate.appendChild(mmcDateTimeDesc);
                mmc.appendChild(mmcDate);
            metaMetadata.appendChild(mmc);
            var mms = doc.createElement('metadataSchema');
                var mmsTxt = doc.createTextNode('LOMv1.0');
                mms.appendChild(mmsTxt);
            metaMetadata.appendChild(mms);
            var mml = doc.createElement('language');
                var mmlTxt = doc.createTextNode('en');
                mml.appendChild(mmlTxt);
            metaMetadata.appendChild(mml);
        return metaMetadata;
    },
    educationalCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var educational = doc.createElement('educational');
            var interactivityType = doc.createElement('interactivityType');
                var itSource = doc.createElement('source');
                    var itSourceTxt = doc.createTextNode('LOMv1.0');
                    itSource.appendChild(itSourceTxt);
                interactivityType.appendChild(itSource);
                var itValue = doc.createElement('value');
                    var itValueTxt = doc.createTextNode('mixed');/////////// Yet to determine
                    itValue.appendChild(itValueTxt);
                interactivityType.appendChild(itValue);
            educational.appendChild(interactivityType);
            /*MULTI?*/ 
            /*var learningResourceType = doc.createElement('learningResourceType');
                var lrtSource = doc.createElement('source');
                    var lrtSourceTxt = doc.createTextNode('LOMv1.0');
                    lrtSource.appendChild(lrtSourceTxt);
                interactivityType.appendChild(lrtSource);
                var lrtValue = doc.createElement('value');
                    var lrtValueTxt = doc.createTextNode('figure');
                    lrtValue.appendChild(lrtValueTxt);
                interactivityType.appendChild(lrtValue);
            educational.appendChild(learningResourceType);*/
            var interactivityLevel = doc.createElement('interactivityLevel');
                var ilSource = doc.createElement('source');
                    var ilSourceTxt = doc.createTextNode('LOMv1.0');
                    ilSource.appendChild(ilSourceTxt);
                interactivityLevel.appendChild(ilSource);
                var ilValue = doc.createElement('value');
                    var ilValueTxt = doc.createTextNode('medium');/////////// Yet to determine
                    ilValue.appendChild(ilValueTxt);
                interactivityLevel.appendChild(ilValue);
            educational.appendChild(interactivityLevel);
            var semanticDensity = doc.createElement('semanticDensity');
                var sdSource = doc.createElement('source');
                    var sdSourceTxt = doc.createTextNode('LOMv1.0');
                    sdSource.appendChild(sdSourceTxt);
                semanticDensity.appendChild(sdSource);
                var sdValue = doc.createElement('value');
                    var sdValueTxt = doc.createTextNode('medium');/////////// Yet to determine
                    sdValue.appendChild(sdValueTxt);
                semanticDensity.appendChild(sdValue);
            educational.appendChild(semanticDensity);
            var intendedEndUserRole = doc.createElement('intendedEndUserRole');
                var ieurSource = doc.createElement('source');
                    var ieurSourceTxt = doc.createTextNode('LOMv1.0');
                    ieurSource.appendChild(ieurSourceTxt);
                intendedEndUserRole.appendChild(ieurSource);
                var ieurValue = doc.createElement('value');
                    var ieurValueTxt = doc.createTextNode('learner');/////////// Yet to determine
                    ieurValue.appendChild(ieurValueTxt);
                intendedEndUserRole.appendChild(ieurValue);
            educational.appendChild(intendedEndUserRole);
            var context = doc.createElement('context');
                var contSource = doc.createElement('source');
                    var contSourceTxt = doc.createTextNode('LOMv1.0');
                    contSource.appendChild(contSourceTxt);
                context.appendChild(contSource);
                var contValue = doc.createElement('value');
                    var contValueTxt = doc.createTextNode(gc.context || 'other');
                    contValue.appendChild(contValueTxt);
                context.appendChild(contValue);
            educational.appendChild(context);
            var typicalAgeRange = doc.createElement('typicalAgeRange');
                var taeString = doc.createElement('string');
                taeString.setAttribute('language', 'en');
                    var taeStringTxt = doc.createTextNode((gc.age.min || 0) + '-' + (gc.age.max || ''));
                    taeString.appendChild(taeStringTxt);
                typicalAgeRange.appendChild(taeString);
            educational.appendChild(typicalAgeRange);
            var difficulty = doc.createElement('difficulty');
                var diffSource = doc.createElement('source');
                    var diffSourceTxt = doc.createTextNode('LOMv1.0');
                    diffSource.appendChild(diffSourceTxt);
                difficulty.appendChild(diffSource);
                var diffValue = doc.createElement('value');
                    var diffValueTxt = doc.createTextNode(gc.difficulty || 'easy');
                    diffValue.appendChild(diffValueTxt);
                difficulty.appendChild(diffValue);
            educational.appendChild(difficulty);
            var tlt = gc.typicalLearningTime;
            var hh = tlt && tlt.h !== 0 && tlt.h !== '';
            var mm = tlt && tlt.m !== 0 && tlt.m !== '';
            var ss = tlt && tlt.s !== 0 && tlt.s !== '';
            if (hh || mm || ss) {
                var typicalLearningTime = doc.createElement('typicalLearningTime');
                    var tltDur = doc.createElement('duration');
                        var tltDurTxt = doc.createTextNode('PT'+ (hh ? (tlt.h + 'H'):'' ) + (mm ? (tlt.m + 'M'):'' ) + (ss ? (tlt.s + 'S'):'' ));
                        tltDur.appendChild(tltDurTxt);
                    typicalLearningTime.appendChild(tltDur);
                    var tltDesc = doc.createElement('description');
                        var tltDescStr = doc.createElement('string');
                        tltDescStr.setAttribute('language','en');
                            var tltDescStrTxt = doc.createTextNode('Average length of time to experience the activity.');
                            tltDescStr.appendChild(tltDescStrTxt);
                        tltDesc.appendChild(tltDescStr);
                    typicalLearningTime.appendChild(tltDesc);
                educational.appendChild(typicalLearningTime);
            }
            var eduLanguage = doc.createElement('language');
                var eduLangTxt = doc.createTextNode(lang);
                eduLanguage.appendChild(eduLangTxt);
            educational.appendChild(eduLanguage);
        return educational;
    },
    relationCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var relation = doc.createElement('relation');
            var relKind = doc.createElement('kind');
                var relKindSource = doc.createElement('source');
                    var relKindSourceTxt = doc.createTextNode('LOMv1.0');
                    relKindSource.appendChild(relKindSourceTxt);
                relKind.appendChild(relKindSource);
                var relKindVal = doc.createElement('value');
                    var relKindValTxt = doc.createTextNode('isbasedon');
                    relKindVal.appendChild(relKindValTxt);
                relKind.appendChild(relKindVal);
            relation.appendChild(relKind);
            var relResource = doc.createElement('resource');
                var relResId = doc.createElement('identifier');
                    var relResIdCat = doc.createElement('catalog');
                        var rricTxt = doc.createTextNode('URI');
                        relResIdCat.appendChild(rricTxt);
                    relResId.appendChild(relResIdCat);
                    var relResIdEntry = doc.createElement('entry');
                        var rrieTxt = doc.createTextNode('http://.....');
                        relResIdCat.appendChild(rrieTxt);
                    relResId.appendChild(relResIdEntry);
                relResource.appendChild(relResId);
                var relResDesc = doc.createElement('description');
                    var relResDescStr = doc.createElement('string');
                    relResDescStr.setAttribute('language', 'en');
                        var rrdsTxt = doc.createTextNode('Microsoft MSCE');
                        relResDescStr.appendChild(rrdsTxt);
                    relResDesc.appendChild(relResDescStr);
                relResource.appendChild(relResDesc);
            relation.appendChild(relResource);
        return relation;
    },
    rightsCreator: function(gc, doc) {
        var lang = gc.language || 'en';
        var date = this.currentDate();
        var rights = doc.createElement('rights');
            var cost = doc.createElement('cost');
                var costSource = doc.createElement('source');
                    var costSourceTxt = doc.createTextNode('LOMv1.0');
                    costSource.appendChild(costSourceTxt);
                cost.appendChild(costSource);
                var costValue = doc.createElement('value');
                    var costValueTxt = doc.createTextNode('no');
                    costValue.appendChild(costValueTxt);
                cost.appendChild(costValue);
            rights.appendChild(cost);
            var copyrightAndOtherRestrictions = doc.createElement('copyrightAndOtherRestrictions');
                var caorSource = doc.createElement('source');
                    var caorSourceTxt = doc.createTextNode('LOMv1.0');
                    caorSource.appendChild(caorSourceTxt);
                copyrightAndOtherRestrictions.appendChild(caorSource);
                var caorValue = doc.createElement('value');
                    var caorValueTxt = doc.createTextNode('yes');
                    caorValue.appendChild(caorValueTxt);
                copyrightAndOtherRestrictions.appendChild(caorValue);
            rights.appendChild(copyrightAndOtherRestrictions);
            var rightsDesc = doc.createElement('description');
                var rightsDescStr = doc.createElement("string");
                rightsDescStr.setAttribute('language', 'en');
                    var rightsDescStrTxt = doc.createTextNode('Open License');
                    rightsDescStr.appendChild(rightsDescStrTxt);
                rightsDesc.appendChild(rightsDescStr);
            rights.appendChild(rightsDesc);
        return rights;
    },
    currentDate: function(){
        var now = new Date();
        var str = now.getFullYear() + '-' +  ("0" + (now.getMonth()+1)).slice(-2) + '-' +  ("0" + now.getDate()).slice(-2) + 'T' +  ("0" + now.getHours()).slice(-2) + ':' +  ("0" + now.getMinutes()).slice(-2) + ':' +  ("0" + now.getSeconds()).slice(-2) + '+' +  ("0" + now.getTimezoneOffset()/-60).slice(-2) + ':00'; 
        return str;
    },
    getIndex: function (navs) {
        return (new EJS({url: Dali.Config.scorm_ejs}).render({navs: navs}));
    },
    xmlOrganizationBranch: function(root_child, actual_child, sections, doc, resource_elements){
        let branch_elements = [];
        if(sections[actual_child].children.length !== 0){
            while(sections[actual_child].children.length > 0){
                let iteration_child = sections[actual_child].children.shift();
                if(iteration_child.indexOf(ID_PREFIX_SECTION) !== -1 ){
                    if(!sections[iteration_child].hidden){
                        branch_elements.push(this.xmlOrganizationBranch(root_child,iteration_child, sections, doc,resource_elements));
                    }
                } else{
                    if(!sections[iteration_child].hidden){
                        let actual_section =  iteration_child;

                        let element = doc.createElement("item");
                        element.setAttribute("identifier", this.santinize_id(sections[actual_section].id) + "_item");
                        element.setAttribute("identifierref", this.santinize_id(sections[actual_section].id) + "_resource");
                        let element_title = doc.createElement("title");
                        let element_text = doc.createTextNode(sections[actual_section].name);
                        element_title.appendChild(element_text);
                        element.appendChild(element_title);

                        let unit;
                        if(typeof sections[actual_section].unitNumber === "undefined"){
                            unit = "blank";
                        } else {
                            unit = sections[actual_section].unitNumber;
                        }

                        resource_elements.push({
                            path: "unit"+ unit + "/" + this.santinize_id(sections[actual_section].id)+".html",
                            id: sections[actual_section].id
                        });


                        branch_elements.push(element);
                    }
                }
            }
        }
        if(!sections[actual_child].hidden){
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

            let unit;
            if(typeof sections[actual_section].unitNumber === "undefined"){
                unit = "blank";
            } else {
                unit = sections[actual_section].unitNumber;
            }

            resource_elements.push({
                    path: "unit"+ unit + "/" + this.santinize_id(sections[actual_section].id)+".html",
                    id: sections[actual_section].id
                });
            
            if(branch_elements.length !== 0){
                for(let n = 0; n < branch_elements.length; n++){
                    element.appendChild(branch_elements[n]);
                }
            }

            return element;
        }
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
    objCreator: function(navsIds, sections, doc) {
        console.log(sections);
        var objectives = doc.createElement("imsss:objectives");
            var primaryObjective = doc.createElement("imsss:primaryObjective");
            primaryObjective.setAttribute("objectiveID", "PRIMARYOBJ");
            primaryObjective.setAttribute("satisfiedByMeasure", "true");
                var minNorMeas = doc.createElement("imsss:minNormalizedMeasure");
                    var mnmTxt = doc.createTextNode(0.8);
                    minNorMeas.appendChild(mnmTxt);
                primaryObjective.appendChild(minNorMeas);
            objectives.appendChild(primaryObjective);
            for (var i = 0; i < navsIds.length; i++) {
                var id = navsIds[i];
                if (Dali.Config.sections_have_content || (!Dali.Config.sections_have_content && !isSection(id))){
                    var newObjective = doc.createElement("imsss:objective");
                    newObjective.setAttribute("objectiveID", id);
                    objectives.appendChild(newObjective);
                }
            }
         return objectives;
    },
    organizationsCreator: function(gc, navsIds, sections, doc) {
        let title = gc.title;
        var organizations = doc.createElement("organizations");
        organizations.setAttribute("default", "GING");
        var organization = doc.createElement("organization");
        organization.setAttribute("identifier", "GING");

            //        ORGANIZATION _TITLE
            var title_org = doc.createElement("title");
                var title_item_txt = doc.createTextNode(title);
                title_org.appendChild(title_item_txt);
            organization.appendChild(title_org);

            var root_element = doc.createElement("item");
            root_element.setAttribute("identifierref", "resource_1");
            root_element.setAttribute("identifier", "item_1");
                var root_title = doc.createElement("title");
                    var item_title = doc.createTextNode(title);
                    root_title.appendChild(item_title);
                root_element.appendChild(root_title);
                var root_seq = doc.createElement("imsss:sequencing");
                    var objectives = this.objCreator(navsIds, sections, doc);
                    root_seq.appendChild(objectives);
                    var deliveryControls = doc.createElement("imsss:deliveryControls");
                    deliveryControls.setAttribute("completionSetByContent", "true");
                    deliveryControls.setAttribute("objectiveSetByContent","true");
                    root_seq.appendChild(deliveryControls);
                root_element.appendChild(root_seq);
            organization.appendChild(root_element);
            var ims_org = doc.createElement("imsss:sequencing");
            var ims_controlMode = doc.createElement("imsss:controlMode");
            ims_controlMode.setAttribute("choice","true");
            ims_controlMode.setAttribute("flow","true");
            organization.appendChild(ims_org);

        organizations.appendChild(organization);
        return organizations;
    },
    santinize_id: function(str) {
        return str.replace(/\-/g,"\_");
    },
    createOldimsManifest: function (title, sections) {
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

            if(!sections[root_section].hidden){
                let children_elements = [];

                let root_element = doc.createElement("item");


                root_element.setAttribute("identifier", this.santinize_id(root_section) + "_item");
                if (Dali.Config.sections_have_content || root_section.indexOf(ID_PREFIX_SECTION) === -1){
                     root_element.setAttribute("identifierref", this.santinize_id(sections[root_section].id) + "_resource");
                }

                let root_element_title = doc.createElement("title");
                let root_element_text = doc.createTextNode(sections[root_section].name);
                root_element_title.appendChild(root_element_text);
                root_element.appendChild(root_element_title);

                let sections_copy = JSON.parse(JSON.stringify(sections));
                children_elements = sections_copy[root_section].children;

                let unit;
                if(typeof sections[root_section].unitNumber === "undefined"){
                    unit = "blank";
                } else {
                    unit = sections[root_section].unitNumber;
                }
                //Added root element for resource iteration
                resource_elements.push({
                    path: "unit"+ unit + "/" + this.santinize_id(sections[root_section].id)+".html",
                    id: sections[root_section].id
                });

                //Unit children Tree
                while (children_elements.length !== 0){
                    let actual_child = children_elements.shift();
                    let branch = this.xmlOrganizationBranch(actual_child, actual_child, sections_copy, doc, resource_elements);
                    if(typeof branch !== "undefined"){
                        root_element.appendChild(branch);
                    }
                }

            //end children Tree
            organization.appendChild(root_element);
            }

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
};
