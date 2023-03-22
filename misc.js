function getClassColor(className) {
    switch (className) {
        case "Death Knight":
            return "#C41E3A";
        case "Demon Hunter":
            return "#A330C9";
        case "Druid":
            return "#FF7C0A";
        case "Evoker":
            return "#33937F";
        case "Hunter":
            return "#AAD372";
        case "Mage":
            return "#3FC7EB";
        case "Monk":
            return "#00FF98";
        case "Paladin":
            return "#F48CBA";
        case "Priest":
            return "#FFFFFF";
        case "Rogue":
            return "#FFF468";
        case "Shaman":
            return "#0070DD";
        case "Warlock":
            return "#8788EE";
        case "Warrior":
            return "#C69B6D";
        default:
            return "#000000"
    }
}

/*value de 0 à 1*/
function getQualityColor(value){
    if (value < 0.2){
        return {background:"#9d9d9d",foreground:"#ffffff"};
    }
    if (value < 0.4){
        return {background:"#ffffff",foreground:"#000000"};
    }
    if (value < 0.6){
        return {background:"#1eff00",foreground:"#ffffff"};
    }
    if (value < 0.8){
        return {background:"#0070dd",foreground:"#ffffff"};
    }
    if (value < 0.9){
        return {background:"#a335ee",foreground:"#ffffff"};
    }
    return {background:"#ff8000",foreground:"#ffffff"};
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("bff-table");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Get the two elements you want to compare,
            one from current row and one from the next: */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (n == 0) {
                /* Check if the two rows should switch place,
                                    based on the direction, asc or desc: */
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        // If so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            } else {
                if (dir == "asc") {
                    if (Number(x.innerHTML.replace("%", "")) > Number(y.innerHTML.replace("%", ""))) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (Number(x.innerHTML.replace("%", "")) < Number(y.innerHTML.replace("%", ""))) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }

        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};