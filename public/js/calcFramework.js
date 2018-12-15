 $(document).ready ( function() {
        
        // init
            $("#div_modifiers select[name='attack.weapon']").css("width","100%")
            .parent().css("height","58px");

            $("#div_modifiers select[name='defense.weapon']").css("width","100%")
            .parent().css("height","58px");

        $("input:not([type=submit])").focus(function(){
            $(this).css("background-color","#b7edf9");
        });

        $("#div_attack input").blur(function(){
            if($(this).val()==0) $(this).css("background-color","#fff");
            else $(this).css("background-color","rgb(169, 223, 169)");
        });

        $("#div_defense input").blur(function(){
            if($(this).val()==0){
                $(this).css("background-color","#fff");
                $(this).css("color","black");
            }else{
                $(this).css("background-color","rgb(238, 25, 25)");
                $(this).css("color","white");
            }
        });
 
        $("#div_modifiers div:first select").change(function(){
            $(this).css("background-color",($(this).val()!=0)?"rgb(169, 223, 169)":"white");
        });

        $("#div_modifiers div:nth-child(3) select").change(function(){
            $(this).css("background-color",($(this).val()!=0)?"rgb(238, 25, 25)":"white");
            if($(this).val()!=0) $(this).css("color","#fff");
        });
        
    });