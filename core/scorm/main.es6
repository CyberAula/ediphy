import Ediphy from '../editor/main';
import { translateLicense } from "../../common/commonTools";

export default {
    createSPAimsManifest: function(exercisesObj, sections, globalConfig, is2004) {
        let doc = document.implementation.createDocument("", "", null);

        // /     ROOT MANIFEST
        let manifest = doc.createElement("manifest");
        manifest.setAttribute("identifier", "com.ediphy.presentation");
        manifest.setAttribute("version", "1.0");
        if (is2004) {
            manifest.setAttribute("xmlns", "http://www.imsglobal.org/xsd/imscp_v1p1");
            manifest.setAttribute("xmlns:adlcp", "http://www.adlnet.org/xsd/adlcp_v1p3");
            manifest.setAttribute("xmlns:adlseq", "http://www.adlnet.org/xsd/adlseq_v1p3");
            manifest.setAttribute("xmlns:adlnav", "http://www.adlnet.org/xsd/adlnav_v1p3");
            manifest.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
            manifest.setAttribute("xmlns:imsss", "http://www.imsglobal.org/xsd/imsss");
            manifest.setAttribute("xsi:schemaLocation", "http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd");

        } else {
            manifest.setAttribute("xmlns", "http://www.imsproject.org/xsd/imscp_rootv1p1p2");
            manifest.setAttribute("xmlns:adlcp", "http://www.adlnet.org/xsd/adlcp_rootv1p2");
            manifest.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
            manifest.setAttribute("xsi:schemaLocation", "http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd");

        }

        let schema_txt = doc.createTextNode("ADL SCORM");
        let schema = doc.createElement("schema");
        schema.appendChild(schema_txt);

        let metadata = doc.createElement("metadata");
        metadata.appendChild(schema);

        let schemaVersion = doc.createElement("schemaversion");
        let schema_version_txt = doc.createTextNode(is2004 ? "2004 4th Edition" : "1.2");
        schemaVersion.appendChild(schema_version_txt);
        metadata.appendChild(schemaVersion);

        metadata = this.lomCreator(globalConfig, doc, metadata);

        // /       ORGANIZATION (USED DEFAULT)
        let organizations = this.organizationsCreator(globalConfig, exercisesObj, sections, doc, is2004);

        // /   RESOURCE ITEMS
        let resources = doc.createElement("resources");
        let resource = doc.createElement("resource");
        resource.setAttribute("identifier", "resource_1");
        resource.setAttribute("type", "webcontent");
        resource.setAttribute((is2004 ? "adlcp:scormType" : "adlcp:scormtype"), "sco");
        resource.setAttribute("href", "dist/index.html");
        let file = doc.createElement("file");
        file.setAttribute("href", "dist/index.html");
        resource.appendChild(file);
        resources.appendChild(resource);

        // Common DATA

        // / APPEND DATA
        manifest.appendChild(metadata);
        manifest.appendChild(organizations);
        manifest.appendChild(resources);

        doc.appendChild(manifest);
        return (this.beautifyXML(new XMLSerializer().serializeToString(doc)));
    },
    lomCreator: function(gc, doc, metadata) {
        let lom = doc.createElement('lom');
        lom.setAttribute('xmlns', "http://ltsc.ieee.org/xsd/LOM");
        lom.setAttribute('xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
        lom.setAttribute('xsi:schemaLocation', "http://ltsc.ieee.org/xsd/LOM lom.xsd");
        // GENERAL
        let general = this.generalCreator(gc, doc);
        lom.appendChild(general);

        // CLASSIFICATION (not implemented)
        // var classification = doc.createElement('classification');
        // lom.appendChild(classification);

        // ANNOTATION
        let annotation = this.annotationCreator(gc, doc);
        lom.appendChild(annotation);

        // LIFE CYCLE
        let lifeCycle = this.lifeCycleCreator(gc, doc);
        lom.appendChild(lifeCycle);

        // TECHNICAL
        let technical = this.technicalCreator(gc, doc);
        lom.appendChild(technical);

        // METAMETADATA
        let metaMetadata = this.metaMetadataCreator(gc, doc);
        lom.appendChild(metaMetadata);

        // EDUCATIONAL
        let educational = this.educationalCreator(gc, doc);
        lom.appendChild(educational);

        // RELATION
        /* var relation = this.relationCreator(gc,doc);
        lom.appendChild(relation); */

        // RIGHTS
        let rights = this.rightsCreator(gc, doc);
        lom.appendChild(rights);

        metadata.appendChild(lom);
        return metadata;
    },
    generalCreator: function(gc, doc) {
        let lang = gc.language || 'en';
        let general = doc.createElement('general');
        let genId = doc.createElement('identifier'); // Identifier
        let genIdCatalog = doc.createElement('catalog');
        let genIdCatalogTxt = doc.createTextNode("URI");
        genIdCatalog.appendChild(genIdCatalogTxt);
        genId.appendChild(genIdCatalog);
        let genIdEntry = doc.createElement('entry');
        let genIdEntryTxt = doc.createTextNode("http://vishub.org");// ////////////////////////NOT IMPLEMENTED YET (Missing info from vish)
        genIdEntry.appendChild(genIdEntryTxt);
        genId.appendChild(genIdEntry);
        general.appendChild(genId);
        let genTitle = doc.createElement('title'); // Title
        let genTitleString = doc.createElement('string');
        genTitleString.setAttribute('language', lang);
        let genTitleStringTxt = doc.createTextNode(gc.title || '---');
        genTitleString.appendChild(genTitleStringTxt);
        genTitle.appendChild(genTitleString);
        general.appendChild(genTitle);
        let genLang = doc.createElement('language'); // Language
        let genLangTxt = doc.createTextNode(lang);
        genLang.appendChild(genLangTxt);
        general.appendChild(genLang);
        let genDesc = doc.createElement('description'); // Description
        let genDescString = doc.createElement('string');
        genDescString.setAttribute('language', lang);
        let genDescStringTxt = doc.createTextNode(gc.description || '...');
        genDescString.appendChild(genDescStringTxt);
        genDesc.appendChild(genDescString);
        general.appendChild(genDesc);
        if (gc.keywords && gc.keywords.length > 0) { // Keywords
            for (let i = 0; i < gc.keywords.length; i++) {
                let genKw = doc.createElement('keyword');
                let genKwString = doc.createElement('string');
                genKwString.setAttribute('language', lang);
                let genKwStringTxt = doc.createTextNode(gc.keywords[i].text);
                genKwString.appendChild(genKwStringTxt);
                genKw.appendChild(genKwString);
                general.appendChild(genKw);
            }
        }
        let genStruc = doc.createElement('structure'); // Structure
        let genStrucSource = doc.createElement('source');
        let genStrucSourceTxt = doc.createTextNode('LOMv1.0');
        genStrucSource.appendChild(genStrucSourceTxt);
        genStruc.appendChild(genStrucSource);
        let genStrucVal = doc.createElement('value');
        let genStrucValTxt = doc.createTextNode('hierarchical'); // DEFAULT
        genStrucVal.appendChild(genStrucValTxt);
        genStruc.appendChild(genStrucVal);
        general.appendChild(genStruc);
        let genAggLevel = doc.createElement('aggregationLevel'); // Aggregation Level
        let genAggLevelSource = doc.createElement('source');
        let genAggLevelSourceTxt = doc.createTextNode('LOMv1.0');
        genAggLevelSource.appendChild(genAggLevelSourceTxt);
        genAggLevel.appendChild(genAggLevelSource);
        let genAggLVal = doc.createElement('value');
        let genAggLValTxt = doc.createTextNode('2'); // DEFAULT
        genAggLVal.appendChild(genAggLValTxt);
        genAggLevel.appendChild(genAggLVal);
        general.appendChild(genAggLevel);
        return general;
    },
    annotationCreator: function(gc, doc) {
        let date = this.currentDate();
        let annotation = doc.createElement('annotation');
        let annEntity = doc.createElement('entity'); // Entity
        let annEntTxt = doc.createTextNode('BEGIN:VCARD&amp;#xD;VERSION:3.0&amp;#xD;N:' + (gc.author || 'anonymous') + '&amp;#xD;FN:' + (gc.author || 'anonymous') + '&amp;#xD;END:VCARD');
        annEntity.appendChild(annEntTxt);
        annotation.appendChild(annEntity);
        let annDate = doc.createElement('date'); // Date
        let annDateTime = doc.createElement('dateTime');
        let annDateTimeTxt = doc.createTextNode(date);
        annDateTime.appendChild(annDateTimeTxt);
        annDate.appendChild(annDateTime);
        let annDateDesc = doc.createElement('description');
        let annDateDescString = doc.createElement('string');
        annDateDescString.setAttribute('language', 'en');
        let annDateDescTxt = doc.createTextNode('This date represents the date the author finished authoring the metadata of the indicated version of the Learning Object.');
        annDateDescString.appendChild(annDateDescTxt);
        annDateDesc.appendChild(annDateDescString);
        annDate.appendChild(annDateDesc);
        annotation.appendChild(annDate);
        return annotation;
    },
    lifeCycleCreator: function(gc, doc) {
        let lang = gc.language || 'en';
        let date = this.currentDate();
        let lifeCycle = doc.createElement('lifeCycle');
        let lcv = doc.createElement('version');
        let lcvStr = doc.createElement('string');
        lcvStr.setAttribute('language', lang);
        let lcvStrTxt = doc.createTextNode(gc.version);
        lcvStr.appendChild(lcvStrTxt);
        lcv.appendChild(lcvStr);
        lifeCycle.appendChild(lcv);
        let lcs = doc.createElement('status');
        let lcss = doc.createElement('source');
        let lcssTxt = doc.createTextNode("LOMv1.0");
        lcss.appendChild(lcssTxt);
        lcs.appendChild(lcss);
        let lcsv = doc.createElement('value');
        let lcsvTxt = doc.createTextNode(gc.status);
        lcsv.appendChild(lcsvTxt);
        lcs.appendChild(lcsv);
        lifeCycle.appendChild(lcs);

        let lcc = doc.createElement('contribute');
        let lccrole = doc.createElement('role');
        let lccrolesource = doc.createElement('source');
        let lccrolesourcetxt = doc.createTextNode('LOMv1.0');
        lccrolesource.appendChild(lccrolesourcetxt);
        lccrole.appendChild(lccrolesource);
        let lccroleval = doc.createElement('value');
        let lccrolevaltxt = doc.createTextNode('author');
        lccroleval.appendChild(lccrolevaltxt);
        lccrole.appendChild(lccroleval);
        lcc.appendChild(lccrole);

        let lccEntity = doc.createElement('entity'); // Entity
        let lcEntTxt = doc.createTextNode('BEGIN:VCARD&amp;#xD;VERSION:3.0&amp;#xD;N:' + (gc.author || 'anonymous') + '&amp;#xD;FN:Sonsoles López Pernas&amp;#xD;END:VCARD'); // / Yet to determine
        lccEntity.appendChild(lcEntTxt);
        lcc.appendChild(lccEntity);
        let lccDate = doc.createElement('date'); // Date
        let lccDateTime = doc.createElement('dateTime');
        let lccDateTimeTxt = doc.createTextNode(date);
        lccDateTime.appendChild(lccDateTimeTxt);
        lccDate.appendChild(lccDateTime);
        lcc.appendChild(lccDate);
        lifeCycle.appendChild(lcc);

        let lcca = doc.createElement('contribute');
        let lccrolea = doc.createElement('role');
        let lccrolesourcea = doc.createElement('source');
        let lccrolesourcetxta = doc.createTextNode('LOMv1.0');
        lccrolesourcea.appendChild(lccrolesourcetxta);
        lccrolea.appendChild(lccrolesourcea);
        let lccrolevala = doc.createElement('value');
        let lccrolevaltxta = doc.createTextNode('technical implementer');
        lccrolevala.appendChild(lccrolevaltxta);
        lccrolea.appendChild(lccrolevala);
        lcca.appendChild(lccrolea);
        let lccEntitya = doc.createElement('entity'); // Entity
        let lcEntTxta = doc.createTextNode('BEGIN:VCARD&#xD;VERSION:3.0&#xD;N:Authoring Tool Ediphy Editor (http://github.com/ging/ediphy)&#xD;FN:Authoring Tool Ediphy Editor (http://github.com/ging/ediphy)&#xD;END:VCARD'); // / Yet to determine
        lccEntitya.appendChild(lcEntTxta);
        lcca.appendChild(lccEntitya);
        let lccDatea = doc.createElement('date'); // Date
        let lccDateTimea = doc.createElement('dateTime');
        let lccDateTimeTxta = doc.createTextNode(date);
        lccDateTimea.appendChild(lccDateTimeTxta);
        lccDatea.appendChild(lccDateTimea);
        lcca.appendChild(lccDatea);
        lifeCycle.appendChild(lcca);

        return lifeCycle;
    },
    technicalCreator: function(gc, doc) {
        let technical = doc.createElement('technical');
        let format = doc.createElement('format');
        let formatTxt = doc.createTextNode('text/html');
        format.appendChild(formatTxt);
        technical.appendChild(format);
        let location = doc.createElement('location');
        let locationTxt = doc.createTextNode('http://vishub.org/'); // Not yet implemented
        location.appendChild(locationTxt);
        technical.appendChild(location);
        let requirement = doc.createElement('requirement');
        let orComposite = doc.createElement('orComposite');
        let orCType = doc.createElement('type');
        let orCTSource = doc.createElement('source');
        let orctsTxt = doc.createTextNode('LOMv1.0');
        orCTSource.appendChild(orctsTxt);
        orCType.appendChild(orCTSource);
        let orCTValue = doc.createElement('value');
        let orctvTxt = doc.createTextNode('browser');
        orCTValue.appendChild(orctvTxt);
        orCType.appendChild(orCTValue);
        orComposite.appendChild(orCType);
        let orCName = doc.createElement('name');
        let orCNSource = doc.createElement('source');
        let orcnsTxt = doc.createTextNode('LOMv1.0');
        orCNSource.appendChild(orcnsTxt);
        orCName.appendChild(orCNSource);
        let orCNValue = doc.createElement('value');
        let orcnvTxt = doc.createTextNode('any');
        orCNValue.appendChild(orcnvTxt);
        orCName.appendChild(orCNValue);
        orComposite.appendChild(orCName);
        requirement.appendChild(orComposite);
        // installationRemarks
        let otherPlatformReqs = doc.createElement('otherPlatformRequirements');
        let oprStr = doc.createElement('string');
        oprStr.setAttribute('language', 'en');
        let oprStrTxt = doc.createTextNode('HTML5-compliant web browser');
        oprStr.appendChild(oprStrTxt);
        otherPlatformReqs.appendChild(oprStr);
        requirement.appendChild(otherPlatformReqs);
        technical.appendChild(requirement);
        return technical;
    },
    metaMetadataCreator: function(gc, doc) {
        let date = this.currentDate();
        let metaMetadata = doc.createElement('metaMetadata');
        // identifier data missing
        let mmc = doc.createElement('contribute');
        let mmcrole = doc.createElement('role');
        let mmcrolesource = doc.createElement('source');
        let mmcrolesourcetxt = doc.createTextNode('LOMv1.0');
        mmcrolesource.appendChild(mmcrolesourcetxt);
        mmcrole.appendChild(mmcrolesource);
        let mmcroleval = doc.createElement('value');
        let mmcrolevaltxt = doc.createTextNode('creator');
        mmcroleval.appendChild(mmcrolevaltxt);
        mmcrole.appendChild(mmcroleval);
        mmc.appendChild(mmcrole);
        let mmcEntity = doc.createElement('entity'); // Entity
        let mmcEntTxt = doc.createTextNode('BEGIN:VCARD&amp;#xD;VERSION:3.0&amp;#xD;N:' + (gc.author || 'anonymous') + '&amp;#xD;FN:' + (gc.author || 'anonymous') + '&amp;#xD;END:VCARD');
        mmcEntity.appendChild(mmcEntTxt);
        mmc.appendChild(mmcEntity);
        let mmcDate = doc.createElement('date'); // Date
        let mmcDateTime = doc.createElement('dateTime');
        let mmcDateTimeTxt = doc.createTextNode(date);
        mmcDateTime.appendChild(mmcDateTimeTxt);
        mmcDate.appendChild(mmcDateTime);
        let mmcDateTimeDesc = doc.createElement('description');
        let mmcDTDStr = doc.createElement('string');
        mmcDTDStr.setAttribute('language', 'en');
        let mmcDateTimeDescTxt = doc.createTextNode('This date represents the date the author finished authoring the metadata of the indicated version of the Learning Object');
        mmcDTDStr.appendChild(mmcDateTimeDescTxt);
        mmcDateTimeDesc.appendChild(mmcDTDStr);
        mmcDate.appendChild(mmcDateTimeDesc);
        mmc.appendChild(mmcDate);
        metaMetadata.appendChild(mmc);
        let mms = doc.createElement('metadataSchema');
        let mmsTxt = doc.createTextNode('LOMv1.0');
        mms.appendChild(mmsTxt);
        metaMetadata.appendChild(mms);
        let mml = doc.createElement('language');
        let mmlTxt = doc.createTextNode('en');
        mml.appendChild(mmlTxt);
        metaMetadata.appendChild(mml);
        return metaMetadata;
    },
    educationalCreator: function(gc, doc) {
        let lang = gc.language || 'en';
        let educational = doc.createElement('educational');
        let interactivityType = doc.createElement('interactivityType');
        let itSource = doc.createElement('source');
        let itSourceTxt = doc.createTextNode('LOMv1.0');
        itSource.appendChild(itSourceTxt);
        interactivityType.appendChild(itSource);
        let itValue = doc.createElement('value');
        let itValueTxt = doc.createTextNode('mixed');// ///////// Yet to determine
        itValue.appendChild(itValueTxt);
        interactivityType.appendChild(itValue);
        educational.appendChild(interactivityType);
        /* MULTI?*/
        /* var learningResourceType = doc.createElement('learningResourceType');
                var lrtSource = doc.createElement('source');
                    var lrtSourceTxt = doc.createTextNode('LOMv1.0');
                    lrtSource.appendChild(lrtSourceTxt);
                interactivityType.appendChild(lrtSource);
                var lrtValue = doc.createElement('value');
                    var lrtValueTxt = doc.createTextNode('figure');
                    lrtValue.appendChild(lrtValueTxt);
                interactivityType.appendChild(lrtValue);
            educational.appendChild(learningResourceType);*/
        let interactivityLevel = doc.createElement('interactivityLevel');
        let ilSource = doc.createElement('source');
        let ilSourceTxt = doc.createTextNode('LOMv1.0');
        ilSource.appendChild(ilSourceTxt);
        interactivityLevel.appendChild(ilSource);
        let ilValue = doc.createElement('value');
        let ilValueTxt = doc.createTextNode('very high');// ///////// Yet to determine
        ilValue.appendChild(ilValueTxt);
        interactivityLevel.appendChild(ilValue);
        educational.appendChild(interactivityLevel);
        let semanticDensity = doc.createElement('semanticDensity');
        let sdSource = doc.createElement('source');
        let sdSourceTxt = doc.createTextNode('LOMv1.0');
        sdSource.appendChild(sdSourceTxt);
        semanticDensity.appendChild(sdSource);
        let sdValue = doc.createElement('value');
        let sdValueTxt = doc.createTextNode('medium');// ///////// Yet to determine
        sdValue.appendChild(sdValueTxt);
        semanticDensity.appendChild(sdValue);
        educational.appendChild(semanticDensity);
        let intendedEndUserRole = doc.createElement('intendedEndUserRole');
        let ieurSource = doc.createElement('source');
        let ieurSourceTxt = doc.createTextNode('LOMv1.0');
        ieurSource.appendChild(ieurSourceTxt);
        intendedEndUserRole.appendChild(ieurSource);
        let ieurValue = doc.createElement('value');
        let ieurValueTxt = doc.createTextNode('learner');// ///////// Yet to determine
        ieurValue.appendChild(ieurValueTxt);
        intendedEndUserRole.appendChild(ieurValue);
        educational.appendChild(intendedEndUserRole);
        if (gc.context) {
            let context = doc.createElement('context');
            let contSource = doc.createElement('source');
            let contSourceTxt = doc.createTextNode('LOMv1.0');
            contSource.appendChild(contSourceTxt);
            context.appendChild(contSource);
            let contValue = doc.createElement('value');
            let realContext = gc.context;
            switch(realContext) {
            case 'preschool':
            case 'peducation':
            case 'seducation':
                realContext = 'school';
                break;
            default:
                break;
            }
            let contValueTxt = doc.createTextNode(realContext);
            contValue.appendChild(contValueTxt);
            context.appendChild(contValue);
            educational.appendChild(context);
        }

        if (gc.age && !(gc.age.min === 0 && gc.age.max === 100)) {
            let typicalAgeRange = doc.createElement('typicalAgeRange');
            let taeString = doc.createElement('string');
            taeString.setAttribute('language', 'en');
            let taeStringTxt = doc.createTextNode((gc.age.min || 0) + '-' + (gc.age.max || ''));
            taeString.appendChild(taeStringTxt);
            typicalAgeRange.appendChild(taeString);
            educational.appendChild(typicalAgeRange);
        }
        if (gc.difficulty) {
            let difficulty = doc.createElement('difficulty');
            let diffSource = doc.createElement('source');
            let diffSourceTxt = doc.createTextNode('LOMv1.0');
            diffSource.appendChild(diffSourceTxt);
            difficulty.appendChild(diffSource);
            let diffValue = doc.createElement('value');
            let diffValueTxt = doc.createTextNode(gc.difficulty);
            diffValue.appendChild(diffValueTxt);
            difficulty.appendChild(diffValue);
            educational.appendChild(difficulty);
        }

        let tlt = gc.typicalLearningTime;
        let hh = tlt && tlt.h;
        let mm = tlt && tlt.m;
        let ss = tlt && tlt.s;
        if (hh || mm || ss) {
            let typicalLearningTime = doc.createElement('typicalLearningTime');
            let tltDur = doc.createElement('duration');
            let tltDurTxt = doc.createTextNode('PT' + (hh ? (tlt.h + 'H') : '') + (mm ? (tlt.m + 'M') : '') + (ss ? (tlt.s + 'S') : ''));
            tltDur.appendChild(tltDurTxt);
            typicalLearningTime.appendChild(tltDur);
            let tltDesc = doc.createElement('description');
            let tltDescStr = doc.createElement('string');
            tltDescStr.setAttribute('language', 'en');
            let tltDescStrTxt = doc.createTextNode('Average length of time to experience the activity.');
            tltDescStr.appendChild(tltDescStrTxt);
            tltDesc.appendChild(tltDescStr);
            typicalLearningTime.appendChild(tltDesc);
            educational.appendChild(typicalLearningTime);
        }
        if (gc.language) {
            let eduLanguage = doc.createElement('language');
            let eduLangTxt = doc.createTextNode(lang);
            eduLanguage.appendChild(eduLangTxt);
            educational.appendChild(eduLanguage);
        }

        return educational;
    },
    relationCreator: function(gc, doc) {
        let relation = doc.createElement('relation');
        let relKind = doc.createElement('kind');
        let relKindSource = doc.createElement('source');
        let relKindSourceTxt = doc.createTextNode('LOMv1.0');
        relKindSource.appendChild(relKindSourceTxt);
        relKind.appendChild(relKindSource);
        let relKindVal = doc.createElement('value');
        let relKindValTxt = doc.createTextNode('isbasedon');
        relKindVal.appendChild(relKindValTxt);
        relKind.appendChild(relKindVal);
        relation.appendChild(relKind);
        let relResource = doc.createElement('resource');
        let relResId = doc.createElement('identifier');
        let relResIdCat = doc.createElement('catalog');
        let rricTxt = doc.createTextNode('URI');
        relResIdCat.appendChild(rricTxt);
        relResId.appendChild(relResIdCat);
        let relResIdEntry = doc.createElement('entry');
        let rrieTxt = doc.createTextNode('http://.....');
        relResIdCat.appendChild(rrieTxt);
        relResId.appendChild(relResIdEntry);
        relResource.appendChild(relResId);
        let relResDesc = doc.createElement('description');
        let relResDescStr = doc.createElement('string');
        relResDescStr.setAttribute('language', 'en');
        let rrdsTxt = doc.createTextNode('Microsoft MSCE');
        relResDescStr.appendChild(rrdsTxt);
        relResDesc.appendChild(relResDescStr);
        relResource.appendChild(relResDesc);
        relation.appendChild(relResource);
        return relation;
    },
    rightsCreator: function(gc, doc) {
        let rights = doc.createElement('rights');
        let cost = doc.createElement('cost');
        let costSource = doc.createElement('source');
        let costSourceTxt = doc.createTextNode('LOMv1.0');
        costSource.appendChild(costSourceTxt);
        cost.appendChild(costSource);
        let costValue = doc.createElement('value');
        let costValueTxt = doc.createTextNode('no');
        costValue.appendChild(costValueTxt);
        cost.appendChild(costValue);
        rights.appendChild(cost);
        let copyrightAndOtherRestrictions = doc.createElement('copyrightAndOtherRestrictions');
        let caorSource = doc.createElement('source');
        let caorSourceTxt = doc.createTextNode('LOMv1.0');
        caorSource.appendChild(caorSourceTxt);
        copyrightAndOtherRestrictions.appendChild(caorSource);
        let caorValue = doc.createElement('value');
        let caorValueTxt = doc.createTextNode('yes');
        caorValue.appendChild(caorValueTxt);
        copyrightAndOtherRestrictions.appendChild(caorValue);
        if (gc.status !== 'Open Domain') {
            rights.appendChild(copyrightAndOtherRestrictions);
        }
        let rightsDesc = doc.createElement('description');
        let rightsDescStr = doc.createElement("string");
        rightsDescStr.setAttribute('language', 'en');
        let rightsDescStrTxt = doc.createTextNode(translateLicense(gc.rights));
        rightsDescStr.appendChild(rightsDescStrTxt);
        rightsDesc.appendChild(rightsDescStr);
        rights.appendChild(rightsDesc);
        return rights;
    },
    currentDate: function() {
        let now = new Date();
        let str = now.getFullYear() + '-' + ("0" + (now.getMonth() + 1)).slice(-2) + '-' + ("0" + now.getDate()).slice(-2) + 'T' + ("0" + now.getHours()).slice(-2) + ':' + ("0" + now.getMinutes()).slice(-2) + ':' + ("0" + now.getSeconds()).slice(-2) + '+' + ("0" + now.getTimezoneOffset() / -60).slice(-2) + ':00';
        return str;
    },
    getIndex: function(navs) {
        return (new EJS({ url: Ediphy.Config.scorm_ejs }).render({ navs: navs }));
    },
    beautifyXML: function(xml) {
        let reg = /(>)\s*(<)(\/*)/g; // updated Mar 30, 2015
        let wsexp = / *(.*) +\n/g;
        let contexp = /(<.+>)(.+\n)/g;
        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
        let formatted = '';
        let lines = xml.split('\n');
        let indent = 0;
        let lastType = 'other';
        // 4 types of tags - single, closing, opening, other (text, doctype, comment) - 4*4 = 16 transitions
        let transitions = {
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
            'other->other': 0,
        };

        for (let i = 0; i < lines.length; i++) {
            let ln = lines[i];
            let single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
            let closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
            let opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
            let type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
            let fromTo = lastType + '->' + type;
            lastType = type;
            let padding = '';

            indent += transitions[fromTo];
            for (let j = 0; j < indent; j++) {
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
    objCreator: function(exercises, sections, doc) {
        let objectives = doc.createElement("imsss:objectives");
        let primaryObjective = doc.createElement("imsss:primaryObjective");
        primaryObjective.setAttribute("objectiveID", "PRIMARYOBJ");
        primaryObjective.setAttribute("satisfiedByMeasure", "true");
        let minNorMeas = doc.createElement("imsss:minNormalizedMeasure");
        let mnmTxt = doc.createTextNode(0.5);
        minNorMeas.appendChild(mnmTxt);
        primaryObjective.appendChild(minNorMeas);
        objectives.appendChild(primaryObjective);
        Object.keys(exercises).map((page)=>{
            Object.keys(exercises[page].exercises).map((box)=>{
                let newObjective = doc.createElement("imsss:objective");
                newObjective.setAttribute("objectiveID", box);
                objectives.appendChild(newObjective);
            });

        });
        return objectives;
    },
    organizationsCreator: function(gc, exercisesObj, sections, doc, is2004) {
        let title = gc.title;
        let organizations = doc.createElement("organizations");
        organizations.setAttribute("default", "GING");
        let organization = doc.createElement("organization");
        organization.setAttribute("identifier", "GING");

        //        ORGANIZATION _TITLE
        let title_org = doc.createElement("title");
        let title_item_txt = doc.createTextNode(title);
        title_org.appendChild(title_item_txt);
        organization.appendChild(title_org);

        let root_element = doc.createElement("item");

        root_element.setAttribute("identifierref", "resource_1");
        root_element.setAttribute("identifier", "item_1");
        root_element.setAttribute("isvisible", "true");
        let root_title = doc.createElement("title");
        let root_title_text = doc.createTextNode(title);

        root_title.appendChild(root_title_text);
        root_element.appendChild(root_title);
        let mastery_score = doc.createElement("adlcp:masteryscore");
        let mastery_score_text = doc.createTextNode("50");
        mastery_score.appendChild(mastery_score_text);
        root_element.appendChild(mastery_score);
        let root_seq = doc.createElement("imsss:sequencing");
        let objectives = this.objCreator(exercisesObj, sections, doc);
        root_seq.appendChild(objectives);
        let deliveryControls = doc.createElement("imsss:deliveryControls");
        deliveryControls.setAttribute("completionSetByContent", "true");
        deliveryControls.setAttribute("objectiveSetByContent", "true");
        root_seq.appendChild(deliveryControls);
        /* if (is2004) {
            root_element.appendChild(root_seq);
        } */
        organization.appendChild(root_element);
        let ims_org = doc.createElement("imsss:sequencing");
        let ims_controlMode = doc.createElement("imsss:controlMode");
        ims_controlMode.setAttribute("choice", "true");
        ims_controlMode.setAttribute("flow", "true");

        if (is2004) {
            organization.appendChild(ims_org);
        }

        organizations.appendChild(organization);
        return organizations;
    },
    santinize_id: function(str) {
        return str.replace(/\-/g, "\_");
    },
};
