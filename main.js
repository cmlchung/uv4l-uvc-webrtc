(function () {
    var signalObj = null;

    window.addEventListener('DOMContentLoaded', function () {
        var isStreaming = false;
        var start = document.getElementById('start');
        var start_mic = document.getElementById('start_mic');
        var stop = document.getElementById('stop');
        var video = document.getElementById('v');
        var sound = document.getElementById('sound');

        start.addEventListener('click', function (e) {
            var address = document.getElementById('address').value;
            var protocol = location.protocol === "https:" ? "wss:" : "ws:";
            var wsurl = protocol + '//' + address;

            if (!isStreaming) {
                signalObj = new signal(wsurl, null,
                        function (stream) {
                            console.log('got a stream!');
                            //var url = window.URL || window.webkitURL;
                            //video.src = url ? url.createObjectURL(stream) : stream; // deprecated
                            video.srcObject = stream;
                            video.play();
                        },
                        function (error) {
                            alert(error);
                        },
                        function () {
                            console.log('websocket closed. bye bye!');
                            video.srcObject = null;
                            //video.src = ''; // deprecated
                            isStreaming = false;
                        },
                        function (message) {
                            alert(message);
                        }
                );
            }
        }, false);

        start_mic.addEventListener('click', function (e) {
            navigator.mediaDevices
                .getUserMedia({
                    audio: true,
                    video: false
                })
                .then(function(stream) {
                    var address = document.getElementById('address').value;
                    var protocol = location.protocol === "https:" ? "wss:" : "ws:";
                    var wsurl = protocol + '//' + address;

                    if (!isStreaming) {
                        signalObj = new signal(wsurl, stream,
                            function (stream) {
                                console.log('got a stream!');
                                //var url = window.URL || window.webkitURL;
                                //video.src = url ? url.createObjectURL(stream) : stream; // deprecated
                                video.srcObject = stream;
                                video.play();
                            },
                            function (error) {
                                alert(error);
                            },
                            function () {
                                console.log('websocket closed. bye bye!');
                                video.srcObject = null;
                                //video.src = ''; // deprecated
                                isStreaming = false;
                            },
                            function (message) {
                                alert(message);
                            }
                    );
                }
            })
            .catch(e => {
                alert(`getUserMedia() error: ${e.name}`);
            });
        }, false);

        stop.addEventListener('click', function (e) {
            if (signalObj) {
                signalObj.hangup();
                signalObj = null;
            }
        }, false);

        sound.addEventListener('click', function (e) {
            video.muted = !sound.checked;
        }, false);

        // Wait until the video stream can play
        video.addEventListener('canplay', function (e) {
            console.log('canplay');
            if (!isStreaming) {
                isStreaming = true;
            }
        }, false);

        // Wait for the video to start to play
        video.addEventListener('play', function () {
            console.log('play');
        }, false);
    });
})();
