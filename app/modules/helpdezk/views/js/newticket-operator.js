var global_coderequest = '';
var htmlArea = '',
    showDefs  = '';

$(document).ready(function () {

    countdown.start(timesession);

    new gnMenu( document.getElementById( 'gn-menu' ) );

    htmlArea = makeAreaCombo();
    showDefs = showDefaults();

    console.log('exist: '+ showDefs);

    if (showDefs == 'YES') {
        $("#areaId").html(htmlArea);
        $.post(path + "/helpdezk/hdkTicket/ajaxTypeWithAreaDefault",
            function (valor) {
                $('#typeId').removeAttr('disabled');
                $("#typeId").html(valor);
                $("#typeId").trigger("chosen:updated");
                return objNewTicket.changeItem();
            })
    } else if (showDefs == 'NO') {
        $("#areaId").html('<option value="X">'+makeSmartyLabel('Select')+'</option>' + htmlArea);
        $("#areaId").val('X');
    }


    $('[data-toggle="tooltip"]').tooltip();

    $("#btnCancel").attr("href", path + '/helpdezk/hdkTicket/index');

    Dropzone.autoDiscover = false;
    var myDropzone = new Dropzone("#myDropzone", {
        url: path + "/helpdezk/hdkTicket/saveTicketAttachments/",
        method: "post",
        dictDefaultMessage: "<br><i class='fa fa-file fa-2x' aria-hidden='true'></i><br>" + makeSmartyLabel('Tckt_drop_file'),
        createImageThumbnails: true,
        maxFiles: ticketAttMaxFiles,
        maxFilesize: hdkMaxSize,
        acceptedFiles: ticketAcceptedFiles,
        parallelUploads: ticketAttMaxFiles,                         // https://github.com/enyo/dropzone/issues/253
        autoProcessQueue: false,
        dictFileTooBig: makeSmartyLabel('hdk_exceed_max_file_size'),
        addRemoveLinks:true,
        dictRemoveFile: makeSmartyLabel('hdk_remove_file')
    });

    myDropzone.on("maxfilesexceeded", function(file) {
        this.removeFile(file);
    });

    myDropzone.on("queuecomplete", function (file) {        // https://stackoverflow.com/questions/18765183/how-do-i-refresh-the-page-after-dropzone-js-upload
        console.log('Completed the dropzone queue');
        sendNotification('new-ticket-user',global_coderequest,true);
        console.log('Sent email, with attachments');
    });

    $('#description').summernote(
        {
            toolbar:[
                ["style",["style"]],
                ["font",["bold","italic","underline","clear"]],
                ["fontname",["fontname"]],["color",["color"]],
                ["para",["ul","ol","paragraph"]],
                ["table",["table"]],
                ["insert",["link"]],
                ["view",["codeview"]],
                ["help",["help"]]
            ],
            disableDragAndDrop: true,
            minHeight: null,  // set minimum height of editor
            maxHeight: 250,   // set maximum height of editor
            height: 250,      // set editor height
            //width: 750,       // set editor width
            focus: false,     // set focus to editable area after initializing summernote
            placeholder:  makeSmartyLabel('Editor_Placeholder_description')

        }
    );

    $('#solution').summernote(
        {
            toolbar:[
                ["style",["style"]],
                ["font",["bold","italic","underline","clear"]],
                ["fontname",["fontname"]],["color",["color"]],
                ["para",["ul","ol","paragraph"]],
                ["table",["table"]],
                ["insert",["link"]],
                ["view",["codeview"]],
                ["help",["help"]]
            ],
            disableDragAndDrop: true,
            minHeight: null,  // set minimum height of editor
            maxHeight: 250,   // set maximum height of editor
            height: 250,      // set editor height
            //width: 750,       // set editor width
            focus: false,     // set focus to editable area after initializing summernote
            placeholder:  makeSmartyLabel('Editor_Placeholder_solution')

        }
    );

    // Combos
    var formNewTicket = $(document.getElementById("newticket-form"));
    var objNewTicket = {
        changeArea: function() {
            var areaId = $("#areaId").val();
            $.post(path+"/helpdezk/hdkTicket/ajaxTypes",{areaId: areaId},
                function(valor){

                    $('#typeId').removeAttr('disabled');

                    if (showDefs == 'YES') {
                        $("#typeId").html(valor);
                        $("#typeId").trigger("chosen:updated");
                        return objNewTicket.changeItem();
                    } else if (showDefs == 'NO') {
                        $("#typeId").html('<option value="X">'+makeSmartyLabel('Select')+'</option>' + valor);
                        $("#typeId").val('X');
                        $("#typeId").trigger("chosen:updated");
                    }

                });
        },
        changeItem: function(){
            var typeId = $("#typeId").val();
            $.post(path+"/helpdezk/hdkTicket/ajaxItens",{typeId: typeId},
                function(valor){
                    $('#itemId').removeAttr('disabled');
                    if (showDefs == 'YES') {
                        $("#itemId").html(valor);
                        $("#itemId").trigger("chosen:updated");
                        return objNewTicket.changeService();
                    } else if (showDefs == 'NO') {
                        $("#itemId").html('<option value="X">'+makeSmartyLabel('Select')+'</option>' + valor);
                        $("#itemId").val('X');
                        $("#itemId").trigger("chosen:updated");
                    }
                });
        },
        changeService: function(){
            var itemId = $("#itemId").val();
            console.log(itemId);
            $.post(path+"/helpdezk/hdkTicket/ajaxServices",{itemId: itemId},
                function(valor){
                    $('#serviceId').removeAttr('disabled');
                    if (showDefs == 'YES') {
                        $("#serviceId").html(valor);
                        $("#serviceId").trigger("chosen:updated");
                        return objNewTicket.changeReason();
                    } else if (showDefs == 'NO') {
                        $("#serviceId").html('<option value="X">'+makeSmartyLabel('Select')+'</option>' + valor);
                        $("#serviceId").val('X');
                        $("#serviceId").trigger("chosen:updated");
                    }

                });
        },
        changeReason: function(){
            var serviceId = $("#serviceId").val();
            console.log(serviceId);
            $.post(path+"/helpdezk/hdkTicket/ajaxReasons",{serviceId: serviceId},
                function(valor){
                    $('#reasonId').removeAttr('disabled');
                    $("#reasonId").html(valor);
                    $("#reasonId").trigger("chosen:updated");
                });
        },
        loadRepassList: function(){
            var repassType = $("input[name='typerep']:checked").val();
            
            $.post(path+"/helpdezk/hdkTicket/ajaxRepassList",{typerep: repassType},
                function(valor){
                    $("#replist").html(valor);
                    $("#replist").trigger("chosen:updated");
                    if(!$("#btnAbilities").hasClass("off")){
                        objNewTicket.getAbilities();
                    }
                    else if(!$("#btnGroups").hasClass("off")){
                        objNewTicket.getGroups();
                    }
                });
        },
        getAbilities: function(){
			var valType = $("input[name='typerep']:checked").val(),
				rep = $("#replist").val(),
                $tabAbiGrp = $("#tabAbiGrp"),
                titleAbiGrp =$("#titleAbiGrp");
                $tabAbiGrp.html('');
                
            $.post(path+"/helpdezk/hdkTicket/ajaxAbilitiesList", {type: valType, rep: rep}, function(data){
                $tabAbiGrp.html('');
                titleAbiGrp.html(aLang['Related_abilities'].replace (/\"/g, ""));
                
                if(data){
                    $tabAbiGrp.html(data);
                }else{
                    $tabAbiGrp.html('<div class="panel-body">'+aLang['No_abilities'].replace (/\"/g, "")+'</div>');
                }
            });
		},
		getGroups: function(){
			var valType = $("input[name=typerep]:checked").val(),
                rep = $("#replist").val(),
                $tabAbiGrp = $("#tabAbiGrp"),
                titleAbiGrp =$("#titleAbiGrp");
                $tabAbiGrp.html('');
				
				$.post(path+"/helpdezk/hdkTicket/ajaxgroupsList", {type: valType, rep: rep}, function(data){
                    $tabAbiGrp.html('');
                    if(valType == "operator")
                        titleAbiGrp.html(aLang['Operator_groups'].replace (/\"/g, ""));
                    else
                        titleAbiGrp.html(aLang['Group_operators'].replace (/\"/g, ""));
		           	
		           	if(data){
                        $tabAbiGrp.html(data);
		           	}else{
                        $tabAbiGrp.html('<div class="panel-body">'+aLang['No_data'].replace (/\"/g, "")+'</div>');
		           	}
		        });
		}

    };

    /**
     ** .validate() is what initializes the Validation plugin on your form.
     ** .valid() returns true or false depending on if your form is presently valid.
     **/
    $("#newticket-form").validate({
        ignore:[],
        rules: {
            subject: "required",  // simple rule, converted to {required:true}
            cmbSource: "required",
            areaId: {
                required: true,
                number: true
            },
            typeId: {
                required: true,
                number: true
            },
            itemId: {
                required: true,
                number: true
            },
            serviceId: {
                required: true,
                number: true
            }
        },
        messages: {
            subject: makeSmartyLabel('Alert_empty_subject'),
            cmbSource: makeSmartyLabel('Alert_field_required'),
            areaId: makeSmartyLabel('Alert_field_required'),
            typeId: makeSmartyLabel('Alert_field_required'),
            itemId: makeSmartyLabel('Alert_field_required'),
            serviceId: makeSmartyLabel('Alert_field_required')
        }

    });

    $("#repass-form").validate({
        ignore:[],
        rules: {
            typerep: "required",  // simple rule, converted to {required:true}
            replist: "required",
            repoptns: "required"
        },
        messages: {
            typerep: makeSmartyLabel('Alert_field_required'),
            typerep: makeSmartyLabel('Alert_field_required'),
            typerep: makeSmartyLabel('Alert_field_required')
        }

    });

    $("#btnCreateTicket").click(function(){

        var ticketDescription = $('#description').summernote('code'),
            periods =  $('#atttime').val().split(":"), 
            open_time = (parseInt(periods[0])*60) + (parseFloat(periods[1])) + (parseFloat(periods[2])/60);

        if ($("#newticket-form").valid()) {
            $.ajax({
                type: "POST",
                url: path + '/helpdezk/hdkTicket/saveTicket',
                dataType: 'json',
                data: { 
                    idrequester:    $("#cmbUser").val(),
                    source:         $("#cmbSource").val(),
                    serial_number: 	$('#serial_number').val(),
                    os_number: 		$('#os_number').val(),
                    tag: 			$('#tag').val(),
                    date:           $('#requestdate').val(),
                    time:           $('#requesttime').val(),
                    area: 			$('#areaId').val(),
                    type: 			$('#typeId').val(),
                    item:			$('#itemId').val(),
                    service:		$('#serviceId').val(),
                    reason:			$('#reasonId').val(),
                    way:            $('#attwayId').val(),
                    subject: 		$('#subject').val(),
                    description: 	$('#description').summernote('code'),
                    solution:       $('#solution').summernote('code'),
                    open_time:     open_time
                },
                error: function (ret) {
                    modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');
                },
                success: function(ret){

                    var obj = jQuery.parseJSON(JSON.stringify(ret));

                    if($.isNumeric(obj.coderequest)) {

                        var ticket = obj.coderequest;

                        //
                        if (myDropzone.getQueuedFiles().length > 0) {
                            console.log('tem '+ myDropzone.getQueuedFiles().length + ' arquivos');
                            global_coderequest = ticket;
                            myDropzone.options.params = {coderequest: ticket };
                            myDropzone.processQueue();
                        } else {
                            console.log('No files, no dropzone processing');
                            sendNotification('new-ticket-user',ticket,false);
                        }
                        //
                        $('#modal-coderequest').html(ticket.substr(0,4)+'-'+ticket.substr(4,2)+'.'+ticket.substr(6,6));
                        $('#modal-expire').html(obj.expire);
                        $('#modal-incharge').html(obj.incharge);

                        $("#btnModalAlert").attr("href", path + '/helpdezk/hdkTicket/index');

                        $('#modal-form-alert').modal('show');

                    } else {

                        modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');

                    }

                },
                beforeSend: function(){
                    $("#btnCancel").attr('disabled','disabled');
                    $("#btnCreateTicket").html("<i class='fa fa-spinner fa-spin'></i> "+ makeSmartyLabel('Processing')).attr('disabled','disabled');
                    $("#btnRepassTicket").attr('disabled','disabled');
                    $("#btnFinishTicket").attr('disabled','disabled');
                },
                complete: function(){
                    $("#btnCancel").removeAttr('disabled');
                    $("#btnCreateTicket").html("<span class='fa fa-check'></span>  " + makeSmartyLabel('Register_btn'));
                }

            });
        } else {
            return false;
        } 

    });

    $("#btnRepassTicket").click(function(){

        var ticketDescription = $('#description').summernote('code'),
            periods =  $('#atttime').val().split(":"), 
            open_time = (parseInt(periods[0])*60) + (parseFloat(periods[1])) + (parseFloat(periods[2])/60);

        if ($("#newticket-form").valid()) {
            $('#modal-form-repass').modal('show');
            objNewTicket.loadRepassList();
        } else {
            return false;
        } 

    });

    $("#btnSendRepassTicket").click(function(){

        var ticketDescription = $('#description').summernote('code'),
            periods =  $('#atttime').val().split(":"), 
            open_time = (parseInt(periods[0])*60) + (parseFloat(periods[1])) + (parseFloat(periods[2])/60);
        
        if($("#newticket-form").valid() && $("#repass-form").valid()){
            
            $.ajax({
                type: "POST",
                url: path + '/helpdezk/hdkTicket/openRepassedTicket',
                dataType: 'json',
                data: { 
                    idrequester:    $("#cmbUser").val(),
                    source:         $("#cmbSource").val(),
                    serial_number: 	$('#serial_number').val(),
                    os_number: 		$('#os_number').val(),
                    tag: 			$('#tag').val(),
                    date:           $('#requestdate').val(),
                    time:           $('#requesttime').val(),
                    area: 			$('#areaId').val(),
                    type: 			$('#typeId').val(),
                    item:			$('#itemId').val(),
                    service:		$('#serviceId').val(),
                    reason:			$('#reasonId').val(),
                    way:            $('#attwayId').val(),
                    subject: 		$('#subject').val(),
                    description: 	$('#description').summernote('code'),
                    solution:       $('#solution').summernote('code'),
                    open_time:      open_time,
                    repassto: 		$('#replist').val(),
                    viewrepass: 	$('input[name="repoptns"]:checked').val(),
                    typerepass:		$('input[name="typerep"]:checked').val()
                },
                error: function (ret) {
                    modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');
                },
                success: function(ret){
                    
                    var obj = jQuery.parseJSON(JSON.stringify(ret));

                    if($.isNumeric(obj.coderequest)) {

                        var ticket = obj.coderequest;

                        //
                        if (myDropzone.getQueuedFiles().length > 0) {
                            console.log('tem '+ myDropzone.getQueuedFiles().length + ' arquivos');
                            global_coderequest = ticket;
                            myDropzone.options.params = {coderequest: ticket };
                            myDropzone.processQueue();
                        } else {
                            console.log('No files, no dropzone processing');
                            sendNotification('new-ticket-user',ticket,false);
                        }
                        //
                        $('#modal-coderequest').html(ticket.substr(0,4)+'-'+ticket.substr(4,2)+'.'+ticket.substr(6,6));
                        $('#modal-expire').html(obj.expire);
                        $('#modal-incharge').html(obj.incharge);

                        $("#btnModalAlert").attr("href", path + '/helpdezk/hdkTicket/index');

                        $('#modal-form-alert').modal('show');

                    } else {

                        modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');

                    }

                },
                beforeSend: function(){
                    $('#modal-form-repass').modal('hide');
                    $("#btnCancel").attr('disabled','disabled');
                    $("#btnCreateTicket").attr('disabled','disabled');
                    $("#btnRepassTicket").html("<i class='fa fa-spinner fa-spin'></i> "+ makeSmartyLabel('Processing')).attr('disabled','disabled');
                    $("#btnFinishTicket").attr('disabled','disabled');
                },
                complete: function(){
                    $("#btnCancel").removeAttr('disabled');
                    $("#btnRepassTicket").html("<span class='fa fa-share'></span>  " + makeSmartyLabel('Repass_btn'));
                }

            });
        } else {
            return false;
        } 

    });

    $("#btnFinishTicket").click(function(){

        var ticketDescription = $('#description').summernote('code'),
            periods =  $('#atttime').val().split(":"), 
            open_time = (parseInt(periods[0])*60) + (parseFloat(periods[1])) + (parseFloat(periods[2])/60);

        if ($("#newticket-form").valid()) {
            $.ajax({
                type: "POST",
                url: path + '/helpdezk/hdkTicket/openFinishTicket',
                dataType: 'json',
                data: { 
                    idrequester:    $("#cmbUser").val(),
                    source:         $("#cmbSource").val(),
                    serial_number: 	$('#serial_number').val(),
                    os_number: 		$('#os_number').val(),
                    tag: 			$('#tag').val(),
                    date:           $('#requestdate').val(),
                    time:           $('#requesttime').val(),
                    area: 			$('#areaId').val(),
                    type: 			$('#typeId').val(),
                    item:			$('#itemId').val(),
                    service:		$('#serviceId').val(),
                    reason:			$('#reasonId').val(),
                    way:            $('#attwayId').val(),
                    subject: 		$('#subject').val(),
                    description: 	$('#description').summernote('code'),
                    solution:       $('#solution').summernote('code'),
                    open_time:     open_time
                },
                error: function (ret) {
                    modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');
                },
                success: function(ret){

                    var obj = jQuery.parseJSON(JSON.stringify(ret));

                    if($.isNumeric(obj.coderequest)) {

                        var ticket = obj.coderequest;

                        //
                        if (myDropzone.getQueuedFiles().length > 0) {
                            console.log('tem '+ myDropzone.getQueuedFiles().length + ' arquivos');
                            global_coderequest = ticket;
                            myDropzone.options.params = {coderequest: ticket };
                            myDropzone.processQueue();
                        } else {
                            console.log('No files, no dropzone processing');
                            sendNotification('new-ticket-user',ticket,false);
                        }
                        //
                        $('#modal-coderequest').html(ticket.substr(0,4)+'-'+ticket.substr(4,2)+'.'+ticket.substr(6,6));
                        $('#modal-expire').html(obj.expire);
                        $('#modal-incharge').html(obj.incharge);

                        $("#btnModalAlert").attr("href", path + '/helpdezk/hdkTicket/index');

                        $('#modal-form-alert').modal('show');

                    } else {

                        modalAlertMultiple('danger',makeSmartyLabel('Alert_failure'),'alert-newticket');

                    }

                },
                beforeSend: function(){
                    $("#btnCancel").attr('disabled','disabled');
                    $("#btnCreateTicket").attr('disabled','disabled');
                    $("#btnRepassTicket").attr('disabled','disabled');
                    $("#btnFinishTicket").html("<i class='fa fa-spinner fa-spin'></i> "+ makeSmartyLabel('Processing')).attr('disabled','disabled');
                },
                complete: function(){
                    $("#btnCancel").removeAttr('disabled');
                    $("#btnFinishTicket").html("<span class='fa fa-times'></span>  " + makeSmartyLabel('Finish_btn'));

                }

            });
        } else {
            return false;
        } 

    });

    $("#areaId").change(function(){
        objNewTicket.changeArea();
    });

    $("#typeId").change(function(){
        objNewTicket.changeItem();
    });

    $("#itemId").change(function(){
        objNewTicket.changeService();
    });

    $("#serviceId").change(function(){
        objNewTicket.changeReason();
    });

    $("input[name='typerep']").on('ifChecked', function() { // bind a function to the change event
        objNewTicket.loadRepassList();
    });

    $("#replist").change(function(){
        if(!$("#btnAbilities").hasClass("off")){
            objNewTicket.getAbilities();
        }
        else if(!$("#btnGroups").hasClass("off")){
            objNewTicket.getGroups();
        }
    });

    /*
     *  Chosen
     */
    $("#cmbUser").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#cmbSource").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#areaId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#typeId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#itemId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#serviceId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#reasonId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#attwayId").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});
    $("#replist").chosen({ width: "100%",    no_results_text: "Nada encontrado!"});

    /*
     * Datepicker
     */
    $('.input-group.date').datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR",
        autoclose: true
    });

    /*
     * Clockpicker
     */
    $('.clockpicker').clockpicker({
        autoclose: true
    });

    /*
     * Count timer  - Stopwatch
     */
    if($('#hidden-timerClock').val() == '1'){
        $('.timer').countimer();
    }else{
        $('.timer').countimer({
            autoStart: false
        });
    }

    $("#btnTimer").click(function(){
        var timerStatus = $('.timer').countimer('stopped');
        //console.log(timerStatus[0]);
        if(timerStatus[0]){$('.timer').countimer('resume');}
        else{$('.timer').countimer('stop');}        
    });

    //btnAbilities btnGroups
    $("#btnAbilities").click(function(){
    	var rep = $("#replist").val(),
            $tabAbiGrp = $("#tabAbiGrp");
        
        if($(this).hasClass("off")){
    		$tabAbiGrp.html('');
    		$(this).removeClass("btn-white off").addClass("btn-default");
    		$("#btnGroups").removeClass("btn-default").addClass("btn-white off");
    		if(rep){
    			objNewTicket.getAbilities();
    		}else{
                $tabAbiGrp.append('<div class="panel-body">'+aLang['Select_group_operator'].replace (/\"/g, "")+'</div>');
    		}
    	}
    	
    });
    
    $("#btnGroups").click(function(){
    	var rep = $("#replist").val(),
            $tabAbiGrp = $("#tabAbiGrp");
            
    	if($(this).hasClass("off")){
            $tabAbiGrp.html('');
    		$(this).removeClass("btn-white off").addClass("btn-default");
    		$("#btnAbilities").removeClass("btn-default").addClass("btn-white off");
    		if(rep){
    			objNewTicket.getGroups();
    		}else{
                $tabAbiGrp.append('<div class="panel-body">'+aLang['Select_group_operator'].replace (/\"/g, "")+'</div>');
            }
    	}
    });

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $("#btnSendApvReqYes").click(function(){
        location.href = path + "/helpdezk/hdkTicket/index" ;
    });

    $("#btnNewTck").click(function(){
        location.href = path + "/helpdezk/hdkTicket/newTicket" ;
    });


});


function makeAreaCombo()
{
    var result="";
    $.ajax({
        url: path+"/helpdezk/hdkTicket/ajaxArea" ,
        type: "POST",
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}

function showDefaults()
{
    var result="";
    $.ajax({
        url: path+"/helpdezk/hdkTicket/showDefaults" ,
        type: "POST",
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;

}

function makeOptLabel(confName)
{
    return '<option value="">'+makeSmartyLabel(confName)+'</option>';
}

function sendNotification(transaction,codeRequest,hasAttachments)
{
    /*
     *
     * This was necessary because in some cases we have to send e-mail with the newly added attachments.
     * We only have access to these attachments after the execution of the dropzone.
     *
     */
    $.ajax({
        url : path + '/helpdezk/hdkTicket/sendNotification',
        type : 'POST',
        data : {
            transaction: transaction,
            code_request: codeRequest,
            has_attachment: hasAttachments
        },
        success : function(data) {

        },
        error : function(request,error)
        {

        }
    });

    return false ;

}

