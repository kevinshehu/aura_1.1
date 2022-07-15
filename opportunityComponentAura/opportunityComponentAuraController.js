({
    doInit: function(component, event, helper){
        // init table columns
        component.set('v.mycolumns', [
            { label: 'AccountId', fieldName: 'AccountId', sortable: "true"},
            { label: 'Name', fieldName: 'Name', sortable: "true"},
            { label: 'ExpectedRevenue', fieldName: 'ExpectedRevenue', sortable: "true"},
            { label: 'DaysSinceCreated__c', fieldName: 'DaysSinceCreated__c', sortable: "true" }
        ]);

        // set user id
        var userId = $A.get("$SObjectType.CurrentUser.Id");
        component.set("v.userId", userId);

        // get field values
        helper.getPriorityVal(component, event);
        helper.getStatusVal(component, event);

        // call apex function
        var action = component.get("c.getOpportunitiesList");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.opportunityList", response.getReturnValue());
             }
          });
        $A.enqueueAction(action);
    },

    doSort: function(component,event,helper){
        var sortBy = event.getParam("fieldName");
        var sortDirection = event.getParam("sortDirection");
        component.set("v.sortBy",sortBy);
        component.set("v.sortDirection",sortDirection);
        helper.sortData(component,sortBy,sortDirection);
    },

    showModal : function(component,event,helper){
        component.set("v.isClicked", true);
    },

    hideModal : function(component,event,helper){
        component.set("v.isClicked", false);
        component.set("v.subjectValue", "");
    },

    createRecord:function(component, event, helper) {
        var toastEventSuccess = $A.get("e.force:showToast");
        toastEventSuccess.setParams({
            title : 'Success',
            message: 'This is a success message',
            duration:'1000',
            key: 'info_alt',
            type: 'success',
            mode: 'pester'
        });

        var toastEventError = $A.get("e.force:showToast");
        toastEventError.setParams({
            title : 'Error',
            message:'This is an error message',
            duration:'1000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });

        var action = component.get('c.createNewTask');
        action.setParams({
            subject:        component.get("v.subjectValue"), 
            status:         component.get("v.statusValue"),
            priority:       component.get("v.priorityValue"),
            OwnerId:        component.get("v.userId"),
            RelatedTo:      component.get("v.recordId")
        });

        action.setCallback(this, function(response) {
            var state = response.getState();

            if (state === "SUCCESS") {
                toastEventSuccess.fire();
            } else {
                toastEventError.fire();
            }
        });
        $A.enqueueAction(action);

        component.set("v.subjectValue", "");
        component.set("v.isClicked", false);
    }
})