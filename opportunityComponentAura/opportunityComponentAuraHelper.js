({
    sortData : function(component,fieldName,sortDirection){
        var data = component.get("v.opportunityList");
        //function to return the value stored in the field
        var key = function(a) { return a[fieldName]; }
        var reverse = sortDirection == 'asc' ? 1: -1;
        data.sort(function(a,b){
                var a = key(a) ? key(a) : '';
                var b = key(b) ? key(b) : '';
                return reverse * ((a>b) - (b>a));
            });
        component.set("v.opportunityList",data);
    },

    getStatusVal: function(component, event) {
        var action = component.get("c.getStatusFieldValues");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                console.log('on result for status val ', result);
                var fieldMap = [];
                for(var key in result){
                    fieldMap.push({key: key, value: result[key]});
                }
                component.set("v.statusValues", fieldMap);
                console.log('status >>>>>', fieldMap);
            }
        });
        $A.enqueueAction(action);
    },


    getPriorityVal: function(component, event) {
        var action = component.get("c.getPriorityFieldValues");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var fieldMap = [];
                for(var key in result){
                    fieldMap.push({key: key, value: result[key]});
                }
                component.set("v.priorityValues", fieldMap);
                console.log('priority >>>>>', fieldMap);
            }
        });
        $A.enqueueAction(action);
    },

})