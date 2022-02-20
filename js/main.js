$(window).load(function() {
    $(".loader").fadeOut(2000);
    $('.hover-effect').hide();
    $('.header ul li a').click(function(){
        $('.header ul li a').removeClass('activebar');
        $(this).addClass('activebar');
    });


    $('.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top -64
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
    
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#scrolltotop').fadeIn();
        } else {
            $('#scrolltotop').fadeOut();
        }
    });
    
    $('#scrolltotop').click(function(){
        $('html, body').animate({scrollTop : 0}, 1500, 'easeInOutExpo');
        return false;
    });
    
    new WOW().init();

    $('body').scrollspy({
        target: '.navbar',
        offset: 65
    })

    let ws = new WebSocket('wss://api.lanyard.rest/socket');
    let Interval;
    ws.onopen = () => {
        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: "342360490422566913",
            },
          })
        );
      
        Interval = setInterval(() => {
          ws.send(
            JSON.stringify({
              op: 3,
            })
          );
        }, 3000);
    };
    ws.onmessage = (msg) => {
     msg = JSON.parse(msg.data);
     if (!['INIT_STATE', 'PRESENCE_UPDATE'].includes(msg.t)) return;
       let user = msg.d;
        // bağımsız olarak çalışıyor
        document.getElementsByClassName("adisspp")[0].src = `https://cdn.discordapp.com/avatars/342360490422566913/${user.discord_user.avatar}?size=4096` 
        document.getElementsByClassName("adisspp2")[0].src = `https://i02.appmifile.com/121_bbs_en/27/02/2021/a54e167eef.gif` 
       if (user.discord_status == "online") {
            document.getElementsByClassName("status")[0].src = "https://emoji.gg/assets/emoji/8312-online.png"
        } else if (user.discord_status == "idle") {
            document.getElementsByClassName("status")[0].src = "https://emoji.gg/assets/emoji/9231-idle.png"
        } else if (user.discord_status == "dnd") {
            document.getElementsByClassName("status")[0].src = "https://emoji.gg/assets/emoji/6290_DND_Status.png"
        } else if (user.discord_status == "offline") {
            document.getElementsByClassName("status")[0].src = "https://emoji.gg/assets/emoji/3830_offline.png"
        }

        // custom status cekmesi icin
        async function customstatus() {
            const presence = (await fetch("https://api.lanyard.rest/v1/users/342360490422566913").then(_res => _res.json()).catch(() => null))?.data;
            if (!presence) return;
            const customStatus = presence.activities.find(_activity => _activity.name === "Custom Status");
            if (customStatus) document.getElementsByClassName("statuss")[0].innerHTML = `${customStatus.emoji?.id ? `<img id="custom-status-emoji" src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}?v=1">` : ""} ${customStatus.state}`;
        }

        customstatus();
        setInterval(customstatus, 5000);

        if (user.listening_to_spotify) {
            $(".artist-name").text(user.spotify.artist + ' tarafından')
            $(".music-name").text(user.spotify.song)
            $(".album-name").text(user.spotify.album + ' albümünde')
            $(".main-status-image").attr("src", `${user.spotify.album_art_url}`);
            $('.etkinlik').fadeIn('fast');

            // timebar icin
            let spotifyElapsedDurationUpdateInterval;
            function formatSongDuration(milliseconds) {
                let hours = 0,
                    minutes = 0,
                    seconds = 0;
        
                while (milliseconds >= 3600000) milliseconds -= 3600000, hours++;
                while (milliseconds >= 60000) milliseconds -= 60000, minutes++;
                while (milliseconds >= 1000) milliseconds -= 1000, seconds++;
        
                return `${hours ? `${hours}:` : ""}${hours ? minutes.toString().padStart(2, "0") : minutes}:${seconds.toString().padStart(2, "0")}`;
            }
        
            async function refreshPresence() {
                // Fetch my presence using Lanyard (Saw that EGGSY used this for his site. Thank you EGGSY!)
                const presence = (await fetch("https://api.lanyard.rest/v1/users/342360490422566913").then(_res => _res.json()).catch(() => null))?.data;
                if (!presence) return;
        
        
                const customStatus = presence.activities.find(_activity => _activity.name === "Custom Status");
                if (customStatus) document.getElementsByClassName("statuss")[0].innerHTML = `${customStatus.emoji?.id ? `<img id="custom-status-emoji" src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? "gif" : "png"}?v=1">` : ""} ${customStatus.state}`;
        
                // Find Spotify presence
                const spotifyPresence = presence.activities.find(_activity => _activity.name === "Spotify");
                // Spotify Presence
        
                const totalDuration = spotifyPresence.timestamps.end - spotifyPresence.timestamps.start;
                // Function to get elapsed duration
                const getElapsedDuration = () => {
                    const elapsedDuration = Date.now() - spotifyPresence.timestamps.start - 1000;
                    return elapsedDuration > totalDuration ? totalDuration : elapsedDuration;
                };
                // Function to update elapsed duration
                const updateElapsedDuration = () => {
                    document.getElementById("spotify-bar").style.width = `${getElapsedDuration() / totalDuration * 100}%`;
                    document.getElementById("sarki-saniye").innerText = formatSongDuration(getElapsedDuration());
                };
                // Update elapsed duration
                updateElapsedDuration();
                // Clear the old elapsed duration update interval
                clearInterval(spotifyElapsedDurationUpdateInterval);
                // Set the new elapsed duration update interval
                spotifyElapsedDurationUpdateInterval = setInterval(updateElapsedDuration, 1);
                // Set total duration text
                document.getElementById("sarki-total-saniye").innerText = formatSongDuration(totalDuration);
                // Display the element
            }
        
            refreshPresence();
            setInterval(refreshPresence, 500);
        } else {
            $('.etkinlik').removeClass('main-body-buttons-active') 
            $('.info').addClass('main-body-buttons-active') 
            document.getElementById('main-etkinlik').style.display = "none";
            document.getElementById('about-you').style.display = "block";
            $('.etkinlik').fadeOut('fast');
        }
    };
});  

setInterval(() => {
    if ($(window).scrollTop() > -1 && ($(window).scrollTop() < 1000)) { 
        $('.two').removeClass('activebar');
        $('.three').removeClass('activebar');
        $('.one').addClass('activebar');
    }else if ($(window).scrollTop() > 1000 && ($(window).scrollTop() < 1550)) {
        $('.one').removeClass('activebar');
        $('.three').removeClass('activebar');
        $('.two').addClass('activebar');
    }else if ($(window).scrollTop() >= 1550) {
        $('.one').removeClass('activebar');
        $('.two').removeClass('activebar');
        $('.three').addClass('activebar');
    }
}, 0);


$(window).load(function() {
    setInterval(function () {
        var age =  new Date() - new Date("2006/06/19");
        age /= 31536000000
        $('.year-title').html(`${age.toFixed(1)}`);
        $('.title-of-year').html(`${age.toFixed(8)}`);
    },1000)
});

function mouseOverH(){
    $('.hover-effect').fadeIn(500);
    setTimeout(() => {
        $('.hover-effect').addClass('display-none');
    }, 500);
}
function mouseblur() {
    $('.hover-effect').fadeOut(500);
    setTimeout(() => {
        $('.hover-effect').removeClass ('display-none');
    }, 500);
}

function scrollThingMouseOver(){
    $('.about-me').removeClass('about-me-non-hover').addClass('about-me-hover');
}

function scrollThingMouseBlur(){
    $('.about-me').removeClass('about-me-hover').addClass('about-me-non-hover');
}

function changestate(efewipedmal) {
    if (efewipedmal) {
        $('.etkinlik').removeClass('main-body-buttons-active') 
        $('.info').addClass('main-body-buttons-active') 
        document.getElementById('main-etkinlik').style.display = "none";
        document.getElementById('about-you').style.display = "block";
    } else {
        $('.info').removeClass('main-body-buttons-active') 
        $('.etkinlik').addClass('main-body-buttons-active')
        document.getElementById('about-you').style.display = "none"; 
        document.getElementById('main-etkinlik').style.display = "inline";
    }
}
