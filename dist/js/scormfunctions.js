   var terminated = false;

    
    /**********************************************************************
    **  Function: loadPage()
    **  Description: This is called when a SCO is first loaded in the
    **               browser (onload()).  It finds the API if it was not
    **               already located and calls Initialize().  In
    **               the terminated global variable is set to false
    **               indicating that the SCO is not yet finished.
    **********************************************************************/
    function loadPage() {
        var result = doInitialize();
        doSetValue("cmi.completion_status", "incomplete");
        var id = findDataStore("test_data_store");
        /*Try setting score*/
        doSetValue("adl.data." + id + ".store", "SAMPLE DATA");
        doSetValue("cmi.score.scaled", 1);
        doSetValue("cmi.score.raw", 10);
        doSetValue("cmi.score.min", 0);
        doSetValue("cmi.score.max", 10);

    }
   

    /**********************************************************************
    **  Function: unloadPage()
    **  Description: This function is called in the case that the user
    **               does not finish the SCO "gracefully".  For example, 
    **               the user may click the "continue" button before
    **               submitting an answer to a question.  In this case,
    **               this function is called as part of the page unloading.
    **               This function ensures that Terminate() is called
    **               even if the user closes the SCO window or navigates
    **               away before finishing the SCO.
    **********************************************************************/
    function unloadPage() {
     
    	if (terminated != true) {
            doSetValue("cmi.success_status", "passed");
            doSetValue("cmi.completion_status", "completed");
    		doTerminate();
            terminated = true;
    	}
    
    }

