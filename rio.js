function start() {
    var name = $("#name").val().split("-")[0]
    var server = $("#name").val().split("-")[1]
    var keyMin = $("#key-min").val()
    var excluded = $("#exclude").val().split(",").map(item => item.trim());

    if (!name || !server || isNaN(keyMin) || keyMin === "") {
        alert("Paramètres incorrects.")
    } else {
        $("#dungeons").html("");
        $("#bff").html("");
        apiGetCharacter(name, server, keyMin, excluded);
    }
}

function apiGetDungeons(char, keyMin, excluded) {
    var totalDj = 0
    var timed = 0;

    let base = `https://raider.io/api/characters/mythic-plus-scored-runs?season=season-df-1&role=all&mode=scored&affixes=all&date=all&characterId=${char.id}`;
    const url = 'https://corsproxy.io/?' + encodeURIComponent(base);
    var jqxhr = $.ajax(url)
        .done(function (result) {
            var bff = [];
            result.dungeons.forEach(dungeon => {
                apiGetDungeon(char, dungeon, keyMin, bff, excluded, function callback(info) {

                    if (info.count > 0) {
                        totalDj += info.count;
                        timed += info.timed;
                    } 
                    updateAverage(keyMin, timed, totalDj);
                });
            });
        })
        .fail(function () {
            // alert("error");
        })
        .always(function () {
            // alert("complete");
        });
}

function updateAverage(keyMin, timed, totalDj) {
    $("#average").html(`Clés timées (${keyMin}+): ${Math.round(100 * timed / totalDj)}% (${timed}/${totalDj})`);
}

function apiGetCharacter(name, server, keyMin, excluded) {
    const url = 'https://corsproxy.io/?' + encodeURIComponent(`https://raider.io/api/characters/eu/${server}/${name}?season=season-df-1&tier=29`);
    var jqxhr = $.ajax(url)
        .done(function (result) {
            
            $("#character-name").css("color", getClassColor(result.characterDetails.character.class.name));
            $("#character-name").html(result.characterDetails.character.name);
            $("#character-server").html(result.characterDetails.character.realm.name);
            $("#character-img").attr("src",result.characterDetails.character.thumbnailUrl);
            $("#character").show()

            apiGetDungeons(result.characterDetails.character, keyMin, excluded);
        })
        .fail(function () {
            // alert("error");
        })
        .always(function () {
            // alert("complete");
        });
}

function apiGetDungeonDetails(bff, runId, char, excluded, callback) {
    var base = `https://raider.io/api/mythic-plus/runs/season-df-1/${runId}`;
    const url = 'https://corsproxy.io/?' + encodeURIComponent(base);
    var details;
    var jqxhr = $.ajax({ url: url })
        .done(function (result) {
            var run = result.keystoneRun;

            var roster = run.roster.map(e => e.character.name);
            const single = roster.some(r => excluded.indexOf(r) >= 0);
            const every = excluded.every(r => roster.includes(r));

            // if (single) {
            //     callback(false)
            //     return;
            // }

            if (every) {
                callback(false)
                return;
            }

            run.roster.forEach(e => {

                // init bff
                if (!bff[e.character.name]) {
                    bff[e.character.name] = { total: 0, timed: 0, average: 0 };
                }
                bff[e.character.name].class = e.character.class.name

                bff[e.character.name].total++;
                if (run.num_chests > 0) {
                    bff[e.character.name].timed++;
                }
                bff[e.character.name].average = 100 * bff[e.character.name].timed / bff[e.character.name].total;

            });
            updateBff(bff, char);
            callback(true);
            //$("#bff").append("<br/>");

        })
        .fail(function () {
            // alert("error");
        })
        .always(function () {
            // alert("complete");
        });

}

function apiGetDungeon(char, dungeon, key_min, bff, excluded, callback) {
    let dj = dungeon.dungeon;
    var name = dj.name;
    var id = dj.id

    var base = `https://raider.io/api/characters/mythic-plus-runs?season=season-df-1&characterId=${char.id}&dungeonId=${id}&role=all&specId=0&mode=scored&affixes=all&date=all`;
    const url = 'https://corsproxy.io/?' + encodeURIComponent(base);

    var jqxhr = $.ajax({ url: url })
        .done(function (result) {

            // filter by minKeylevel
            var filter = result.runs.filter(e => e.summary.mythic_level >= key_min);

            var timed = 0;
            var count = 0;
            var i = 0;
            filter.forEach(run => {

                apiGetDungeonDetails(bff, run.summary.keystone_run_id, char, excluded, function cb(valid) {
                    i++;
                    if (valid) {
                        if (run.summary.num_chests > 0) {
                            timed++;
                        }
                        count++;
                    }
                    if (i == filter.length) {
                        var average = parseFloat(timed / count) || 0;
                        $("#dungeons").append(`${name} :<br/> ${count} runs - `)
                        $("#dungeons").append(`${Math.round(100 * average)}%<br/><br/>`);
                        callback({ count, timed });
                    }
                });

            });



        })
        .fail(function () {
            // alert("error");
        })
        .always(function () {
            // alert("complete");
        });
}

function updateBff(bff, char) {
    $("#bff").html("");

    // Create items array
    var sorted = Object.keys(bff).map(function (key) {
        return [key, bff[key]];
    });

    // Sort the array based on the second element
    sorted.sort(function (first, second) {
        return second[1].average - first[1].average;
    });

    sorted.forEach(e => {
        if (e[1].total < 2 || e[0] === char.name) {
            return;
        }
        addBffRow(e);

    })
}
function addBffRow(e) {
    var str = `<tr>
        <td style="color:${getClassColor(e[1].class)};font-weight:bold">${e[0].split("-")[0]}</td>
        <td>${e[1].total}</td>
        <td>${Math.round(e[1].average)}%</td>
        </tr>`;
    $("#bff").append(str)
}
