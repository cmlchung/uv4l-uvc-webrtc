(function () {
    var signalObj = null;

    window.addEventListener('DOMContentLoaded', function () {
        var isStreaming = false;
        var start = document.getElementById('start');
        var start_mic = document.getElementById('start_mic');
        var stop = document.getElementById('stop');
        var video = document.getElementById('v');
        var canvas = document.getElementById('c');
        var ctx = canvas.getContext('2d');

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
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
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
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
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

        // Wait until the video stream can play
        video.addEventListener('canplay', function (e) {
            console.log('canplay');
            if (!isStreaming) {
                canvas.setAttribute('width', video.videoWidth);
                canvas.setAttribute('height', video.videoHeight);
                isStreaming = true;
            }
        }, false);

        // Wait for the video to start to play
        video.addEventListener('play', function () {
            console.log('play');
            // Every 33 milliseconds copy the video image to the canvas
            setInterval(function () {
                if (video.paused || video.ended) {
                    return;
                }
                var w = canvas.getAttribute('width');
                var h = canvas.getAttribute('height');
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(video, 0, 0, w, h);
            }, 33);
        }, false);
    });
})();
