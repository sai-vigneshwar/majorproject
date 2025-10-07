import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Button, Box, Paper, Typography, Stack, InputAdornment } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import server from '../environment';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(true);

    let [audio, setAudio] = useState(true);

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);
    let [isJoined, setIsJoined] = useState(false);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    

    useEffect(() => {
        console.log("HELLO")
        getPermissions();

    })

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            if (!isJoined) {
                getUserMedia();
            } else {
                try {
                    if (window.localStream) {
                        const [videoTrack] = window.localStream.getVideoTracks();
                        const [audioTrack] = window.localStream.getAudioTracks();
                        if (videoTrack) videoTrack.enabled = !!video;
                        if (audioTrack) audioTrack.enabled = !!audio;
                    }
                } catch (e) { console.log(e); }
            }
            console.log("SET STATE HAS ", video, audio);
        }
    }, [video, audio, isJoined])
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
        setIsJoined(true);
    }




    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            if (!connections[id].localStreamAdded) {
                connections[id].addStream(window.localStream)
                connections[id].localStreamAdded = true;
            }

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            if (track.kind === 'video') {
                setVideo(false);
                // stop sending video to peers
                try {
                    for (let id in connections) {
                        const pc = connections[id];
                        if (!pc || !pc.getSenders) continue;
                        const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
                        if (sender && sender.replaceTrack) {
                            sender.replaceTrack(null).catch(() => {});
                        }
                    }
                } catch (_) {}
            }
            if (track.kind === 'audio') {
                setAudio(false);
            }
            // keep existing stream; do not replace with black/silence here
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }





    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }




    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    if (socketListId === socketIdRef.current) {
                        return; // skip creating a connection to self
                    }

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate      
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(v =>
                                    v.socketId === socketListId ? { ...v, stream: event.stream } : v
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                // Prevent duplication just in case
                                const exists = videos.some(v => v.socketId === socketListId);
                                const updatedVideos = exists ? videos : [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };


                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        if (!connections[socketListId].localStreamAdded) {
                            connections[socketListId].addStream(window.localStream)
                            connections[socketListId].localStreamAdded = true;
                        }
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        if (!connections[socketListId].localStreamAdded) {
                            connections[socketListId].addStream(window.localStream)
                            connections[socketListId].localStreamAdded = true;
                        }
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            if (!connections[id2].localStreamAdded && window.localStream) {
                                connections[id2].addStream(window.localStream)
                                connections[id2].localStreamAdded = true;
                            }
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        const next = !video;
        setVideo(next);

        try {
            if (!window.localStream) return;

            if (!next) {
                // Video is being turned OFF
                const currentVideoTracks = window.localStream.getVideoTracks();
                const oldTrack = currentVideoTracks[0];

                if (oldTrack) {
                    oldTrack.stop();
                    window.localStream.removeTrack(oldTrack);
                }

                if (localVideoref.current) {
                    localVideoref.current.srcObject = null;
                }

                for (let id in connections) {
                    const pc = connections[id];
                    if (pc && pc.getSenders) {
                        const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
                        if (videoSender) {
                            videoSender.replaceTrack(null).catch(() => {});
                        }
                    }
                }
            } else {
                // Video is being turned ON
                navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                    .then((media) => {
                        const [newTrack] = media.getVideoTracks();
                        if (!newTrack) return;

                        window.localStream.addTrack(newTrack);

                        if (localVideoref.current) {
                            localVideoref.current.srcObject = window.localStream;
                        }

                        for (let id in connections) {
                            const pc = connections[id];
                            if (pc && pc.getSenders) {
                                const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
                                if (videoSender) {
                                    videoSender.replaceTrack(newTrack).catch(() => {});
                                } else {
                                    pc.addTrack(newTrack, window.localStream);
                                }
                            }
                        }
                    })
                    .catch((e) => console.log(e));
            }
        } catch (e) {
            console.log(e);
        }
    };
    let handleAudio = () => {
        const next = !audio;
        setAudio(next)
        try {
            if (!window.localStream) return;
            const [track] = window.localStream.getAudioTracks();
            if (!track) return;
            track.enabled = next;
            // Ensure sender track state is in sync (not strictly necessary if just enabling/disabling)
            for (let id in connections) {
                const pc = connections[id];
                if (!pc) continue;
                const senders = pc.getSenders ? pc.getSenders() : [];
                let audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
                if (audioSender && audioSender.replaceTrack) {
                    audioSender.replaceTrack(track).catch(() => {});
                }
            }
        } catch (e) { console.log(e); }
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    let closeChat = () => {
        setModal(false);
    }
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };



    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }


    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }


    return (
        <div>

            {askForUsername === true ?

                <Box sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, sm: 3 },
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e8eef3 50%, #dfe7f0 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-30%',
                        right: '-15%',
                        width: '700px',
                        height: '700px',
                        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                    }
                }}>
                    <Box sx={{
                        width: '100%',
                        maxWidth: 1200,
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        gap: { xs: 3, sm: 4 },
                        alignItems: 'stretch',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <Paper elevation={0} sx={{
                            p: { xs: 3, sm: 5 },
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                            border: '1px solid rgba(108,99,255,0.15)',
                            borderRadius: '28px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 60px rgba(108,99,255,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Box sx={{
                                width: 64,
                                height: 64,
                                background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 3,
                                boxShadow: '0 8px 24px rgba(108,99,255,0.35)'
                            }}>
                                <VideocamIcon sx={{ color: 'white', fontSize: '2rem' }} />
                            </Box>
                            <Typography variant="h4" sx={{ 
                                color: '#2c3e50', 
                                fontWeight: 800, 
                                mb: 1.5,
                                letterSpacing: '-0.5px'
                            }}>
                                Join Meeting
                            </Typography>
                            <Typography variant="body1" sx={{ 
                                color: '#5a6c7d', 
                                mb: 4,
                                lineHeight: 1.6
                            }}>
                                Enter your name and preview your camera before joining the meeting.
                            </Typography>
                            <Stack spacing={2.5}>
                                <TextField
                                    id="outlined-basic"
                                    label="Your Name"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && username.trim() && connect()}
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Enter your display name"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            borderRadius: '14px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.95)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'white',
                                            }
                                        }
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Box sx={{ color: '#6C63FF', display: 'flex' }}>
                                                    👤
                                                </Box>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    onClick={connect}
                                    disabled={!username.trim()}
                                    sx={{ 
                                        py: 1.8,
                                        fontSize: '1.05rem',
                                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 8px 24px rgba(108,99,255,0.35)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 32px rgba(108,99,255,0.45)',
                                            background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)'
                                        },
                                        '&:disabled': {
                                            background: 'rgba(0,0,0,0.12)',
                                            color: 'rgba(0,0,0,0.26)'
                                        }
                                    }}
                                >
                                    Join Now
                                </Button>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{
                            p: 2,
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                            border: '1px solid rgba(108,99,255,0.15)',
                            borderRadius: '28px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 60px rgba(108,99,255,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Typography variant="caption" sx={{ 
                                color: '#5a6c7d',
                                mb: 1.5,
                                px: 1,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '0.7rem'
                            }}>
                                Camera Preview
                            </Typography>
                            <Box
                                component="video"
                                ref={localVideoref}
                                autoPlay
                                muted
                                sx={{
                                    width: '100%',
                                    aspectRatio: '16 / 9',
                                    bgcolor: '#1a1a1a',
                                    borderRadius: '20px',
                                    boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
                                    objectFit: 'cover'
                                }}
                            />
                        </Paper>
                    </Box>
                </Box> :


                <div className={styles.meetVideoContainer}>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <div className={styles.chatHeader}>
                                <h1>Chat</h1>
                                <div className={styles.closeChat} onClick={() => setModal(false)}>
                                    ×
                                </div>
                            </div>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    return (
                                        <div key={index} className={styles.messageWrapper}>
                                            <span className={styles.messageSender}>{item.sender}</span>
                                            <div className={styles.messageBubble}>
                                                <p>{item.data}</p>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <Box sx={{ 
                                        textAlign: 'center', 
                                        py: 6,
                                        color: '#5a6c7d',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%'
                                    }}>
                                        <ChatIcon sx={{ fontSize: 56, color: '#6C63FF', opacity: 0.4, mb: 2 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
                                            No messages yet
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#8a96a3' }}>
                                            Start the conversation by sending a message
                                        </Typography>
                                    </Box>
                                )}


                            </div>

                            <div className={styles.chattingArea}>
                                <TextField 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    onKeyPress={(e) => e.key === 'Enter' && message.trim() && sendMessage()}
                                    id="outlined-basic" 
                                    label="Type a message..." 
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    multiline
                                    maxRows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            borderRadius: '14px',
                                            border: '2px solid rgba(108,99,255,0.15)',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                borderColor: 'rgba(108,99,255,0.25)',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: 'white',
                                                borderColor: '#6C63FF',
                                            }
                                        }
                                    }}
                                />
                                <Button 
                                    variant='contained' 
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    sx={{
                                        px: 3,
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #6C63FF 0%, #5a52d5 100%)',
                                        borderRadius: '14px',
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        boxShadow: '0 6px 18px rgba(108,99,255,0.35)',
                                        whiteSpace: 'nowrap',
                                        minWidth: '80px',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #7b72ff 0%, #6b63e5 100%)',
                                            boxShadow: '0 8px 24px rgba(108,99,255,0.45)',
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:disabled': {
                                            background: 'rgba(0,0,0,0.12)',
                                            color: 'rgba(0,0,0,0.26)'
                                        }
                                    }}
                                >
                                    Send
                                </Button>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton 
                            onClick={handleVideo} 
                            sx={{ 
                                color: video ? '#6C63FF' : '#5a6c7d',
                                '&:hover': { color: '#6C63FF' }
                            }}
                        >
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton 
                            onClick={handleEndCall} 
                            data-end-call="true"
                            sx={{ color: 'white' }}
                        >
                            <CallEndIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleAudio} 
                            sx={{ 
                                color: audio ? '#6C63FF' : '#5a6c7d',
                                '&:hover': { color: '#6C63FF' }
                            }}
                        >
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton 
                                onClick={handleScreen} 
                                sx={{ 
                                    color: screen ? '#6C63FF' : '#5a6c7d',
                                    '&:hover': { color: '#6C63FF' }
                                }}
                            >
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge 
                            badgeContent={newMessages} 
                            max={999} 
                            sx={{
                                '& .MuiBadge-badge': {
                                    background: 'linear-gradient(135deg, #FF6584 0%, #FF4757 100%)',
                                    color: 'white',
                                    fontWeight: 700
                                }
                            }}
                        >
                            <IconButton 
                                onClick={() => setModal(!showModal)} 
                                sx={{ 
                                    color: showModal ? '#6C63FF' : '#5a6c7d',
                                    '&:hover': { color: '#6C63FF' }
                                }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                    </div>


                    {/* This is the updated part for local video rendering */}
                    {video && <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>}
                    {!video && <div className={styles.videoOffPlaceholder}>
                        <VideocamOffIcon sx={{ fontSize: 48, color: '#6C63FF' }} />
                        <Typography variant="body1" sx={{ color: '#5a6c7d', fontWeight: 600 }}>Camera Off</Typography>
                    </div>}


                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video

                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}











// import React, { useEffect, useRef, useState } from 'react'
// import io from "socket.io-client";
// import { Badge, IconButton, TextField, Button, Box, Paper, Typography, Stack } from '@mui/material';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideocamOffIcon from '@mui/icons-material/VideocamOff'
// import styles from "../styles/videoComponent.module.css";
// import CallEndIcon from '@mui/icons-material/CallEnd'
// import MicIcon from '@mui/icons-material/Mic'
// import MicOffIcon from '@mui/icons-material/MicOff'
// import ScreenShareIcon from '@mui/icons-material/ScreenShare';
// import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
// import ChatIcon from '@mui/icons-material/Chat'
// import server from '../environment';

// const server_url = server;

// var connections = {};

// const peerConfigConnections = {
//     "iceServers": [
//         { "urls": "stun:stun.l.google.com:19302" }
//     ]
// }

// export default function VideoMeetComponent() {

//     var socketRef = useRef();
//     let socketIdRef = useRef();

//     let localVideoref = useRef();

//     let [videoAvailable, setVideoAvailable] = useState(true);

//     let [audioAvailable, setAudioAvailable] = useState(true);

//     let [video, setVideo] = useState(true);

//     let [audio, setAudio] = useState(true);

//     let [screen, setScreen] = useState();

//     let [showModal, setModal] = useState(true);

//     let [screenAvailable, setScreenAvailable] = useState();

//     let [messages, setMessages] = useState([])

//     let [message, setMessage] = useState("");

//     let [newMessages, setNewMessages] = useState(3);

//     let [askForUsername, setAskForUsername] = useState(true);
//     let [isJoined, setIsJoined] = useState(false);

//     let [username, setUsername] = useState("");

//     const videoRef = useRef([])

//     let [videos, setVideos] = useState([])

//     // TODO
//     // if(isChrome() === false) {


//     // }

//     useEffect(() => {
//         console.log("HELLO")
//         getPermissions();

//     })

//     let getDislayMedia = () => {
//         if (screen) {
//             if (navigator.mediaDevices.getDisplayMedia) {
//                 navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
//                     .then(getDislayMediaSuccess)
//                     .then((stream) => { })
//                     .catch((e) => console.log(e))
//             }
//         }
//     }

//     const getPermissions = async () => {
//         try {
//             const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
//             if (videoPermission) {
//                 setVideoAvailable(true);
//                 console.log('Video permission granted');
//             } else {
//                 setVideoAvailable(false);
//                 console.log('Video permission denied');
//             }

//             const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
//             if (audioPermission) {
//                 setAudioAvailable(true);
//                 console.log('Audio permission granted');
//             } else {
//                 setAudioAvailable(false);
//                 console.log('Audio permission denied');
//             }

//             if (navigator.mediaDevices.getDisplayMedia) {
//                 setScreenAvailable(true);
//             } else {
//                 setScreenAvailable(false);
//             }

//             if (videoAvailable || audioAvailable) {
//                 const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
//                 if (userMediaStream) {
//                     window.localStream = userMediaStream;
//                     if (localVideoref.current) {
//                         localVideoref.current.srcObject = userMediaStream;
//                     }
//                 }
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     useEffect(() => {
//         if (video !== undefined && audio !== undefined) {
//             if (!isJoined) {
//                 getUserMedia();
//             } else {
//                 try {
//                     if (window.localStream) {
//                         const [videoTrack] = window.localStream.getVideoTracks();
//                         const [audioTrack] = window.localStream.getAudioTracks();
//                         if (videoTrack) videoTrack.enabled = !!video;
//                         if (audioTrack) audioTrack.enabled = !!audio;
//                     }
//                 } catch (e) { console.log(e); }
//             }
//             console.log("SET STATE HAS ", video, audio);
//         }
//     }, [video, audio, isJoined])
//     let getMedia = () => {
//         setVideo(videoAvailable);
//         setAudio(audioAvailable);
//         connectToSocketServer();
//         setIsJoined(true);
//     }




//     let getUserMediaSuccess = (stream) => {
//         try {
//             window.localStream.getTracks().forEach(track => track.stop())
//         } catch (e) { console.log(e) }

//         window.localStream = stream
//         localVideoref.current.srcObject = stream

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue

//             if (!connections[id].localStreamAdded) {
//                 connections[id].addStream(window.localStream)
//                 connections[id].localStreamAdded = true;
//             }

//             connections[id].createOffer().then((description) => {
//                 console.log(description)
//                 connections[id].setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
//                     })
//                     .catch(e => console.log(e))
//             })
//         }

//         stream.getTracks().forEach(track => track.onended = () => {
//             if (track.kind === 'video') {
//                 setVideo(false);
//                 // stop sending video to peers
//                 try {
//                     for (let id in connections) {
//                         const pc = connections[id];
//                         if (!pc || !pc.getSenders) continue;
//                         const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
//                         if (sender && sender.replaceTrack) {
//                             sender.replaceTrack(null).catch(() => {});
//                         }
//                     }
//                 } catch (_) {}
//             }
//             if (track.kind === 'audio') {
//                 setAudio(false);
//             }
//             // keep existing stream; do not replace with black/silence here
//         })
//     }

//     let getUserMedia = () => {
//         if ((video && videoAvailable) || (audio && audioAvailable)) {
//             navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
//                 .then(getUserMediaSuccess)
//                 .then((stream) => { })
//                 .catch((e) => console.log(e))
//         } else {
//             try {
//                 let tracks = localVideoref.current.srcObject.getTracks()
//                 tracks.forEach(track => track.stop())
//             } catch (e) { }
//         }
//     }





//     let getDislayMediaSuccess = (stream) => {
//         console.log("HERE")
//         try {
//             window.localStream.getTracks().forEach(track => track.stop())
//         } catch (e) { console.log(e) }

//         window.localStream = stream
//         localVideoref.current.srcObject = stream

//         for (let id in connections) {
//             if (id === socketIdRef.current) continue

//             connections[id].addStream(window.localStream)

//             connections[id].createOffer().then((description) => {
//                 connections[id].setLocalDescription(description)
//                     .then(() => {
//                         socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
//                     })
//                     .catch(e => console.log(e))
//             })
//         }

//         stream.getTracks().forEach(track => track.onended = () => {
//             setScreen(false)

//             try {
//                 let tracks = localVideoref.current.srcObject.getTracks()
//                 tracks.forEach(track => track.stop())
//             } catch (e) { console.log(e) }

//             let blackSilence = (...args) => new MediaStream([black(...args), silence()])
//             window.localStream = blackSilence()
//             localVideoref.current.srcObject = window.localStream

//             getUserMedia()

//         })
//     }

//     let gotMessageFromServer = (fromId, message) => {
//         var signal = JSON.parse(message)

//         if (fromId !== socketIdRef.current) {
//             if (signal.sdp) {
//                 connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
//                     if (signal.sdp.type === 'offer') {
//                         connections[fromId].createAnswer().then((description) => {
//                             connections[fromId].setLocalDescription(description).then(() => {
//                                 socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
//                             }).catch(e => console.log(e))
//                         }).catch(e => console.log(e))
//                     }
//                 }).catch(e => console.log(e))
//             }

//             if (signal.ice) {
//                 connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
//             }
//         }
//     }




//     let connectToSocketServer = () => {
//         socketRef.current = io.connect(server_url, { secure: false })

//         socketRef.current.on('signal', gotMessageFromServer)

//         socketRef.current.on('connect', () => {
//             socketRef.current.emit('join-call', window.location.href)
//             socketIdRef.current = socketRef.current.id

//             socketRef.current.on('chat-message', addMessage)

//             socketRef.current.on('user-left', (id) => {
//                 setVideos((videos) => videos.filter((video) => video.socketId !== id))
//             })

//             socketRef.current.on('user-joined', (id, clients) => {
//                 clients.forEach((socketListId) => {

//                     if (socketListId === socketIdRef.current) {
//                         return; // skip creating a connection to self
//                     }

//                     connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
//                     // Wait for their ice candidate       
//                     connections[socketListId].onicecandidate = function (event) {
//                         if (event.candidate != null) {
//                             socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
//                         }
//                     }

//                     // Wait for their video stream
//                     connections[socketListId].onaddstream = (event) => {
//                         console.log("BEFORE:", videoRef.current);
//                         console.log("FINDING ID: ", socketListId);

//                         let videoExists = videoRef.current.find(video => video.socketId === socketListId);

//                         if (videoExists) {
//                             console.log("FOUND EXISTING");

//                             // Update the stream of the existing video
//                             setVideos(videos => {
//                                 const updatedVideos = videos.map(v =>
//                                     v.socketId === socketListId ? { ...v, stream: event.stream } : v
//                                 );
//                                 videoRef.current = updatedVideos;
//                                 return updatedVideos;
//                             });
//                         } else {
//                             // Create a new video
//                             console.log("CREATING NEW");
//                             let newVideo = {
//                                 socketId: socketListId,
//                                 stream: event.stream,
//                                 autoplay: true,
//                                 playsinline: true
//                             };

//                             setVideos(videos => {
//                                 // Prevent duplication just in case
//                                 const exists = videos.some(v => v.socketId === socketListId);
//                                 const updatedVideos = exists ? videos : [...videos, newVideo];
//                                 videoRef.current = updatedVideos;
//                                 return updatedVideos;
//                             });
//                         }
//                     };


//                     // Add the local video stream
//                     if (window.localStream !== undefined && window.localStream !== null) {
//                         if (!connections[socketListId].localStreamAdded) {
//                             connections[socketListId].addStream(window.localStream)
//                             connections[socketListId].localStreamAdded = true;
//                         }
//                     } else {
//                         let blackSilence = (...args) => new MediaStream([black(...args), silence()])
//                         window.localStream = blackSilence()
//                         if (!connections[socketListId].localStreamAdded) {
//                             connections[socketListId].addStream(window.localStream)
//                             connections[socketListId].localStreamAdded = true;
//                         }
//                     }
//                 })

//                 if (id === socketIdRef.current) {
//                     for (let id2 in connections) {
//                         if (id2 === socketIdRef.current) continue

//                         try {
//                             if (!connections[id2].localStreamAdded && window.localStream) {
//                                 connections[id2].addStream(window.localStream)
//                                 connections[id2].localStreamAdded = true;
//                             }
//                         } catch (e) { }

//                         connections[id2].createOffer().then((description) => {
//                             connections[id2].setLocalDescription(description)
//                                 .then(() => {
//                                     socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
//                                 })
//                                 .catch(e => console.log(e))
//                         })
//                     }
//                 }
//             })
//         })
//     }

//     let silence = () => {
//         let ctx = new AudioContext()
//         let oscillator = ctx.createOscillator()
//         let dst = oscillator.connect(ctx.createMediaStreamDestination())
//         oscillator.start()
//         ctx.resume()
//         return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
//     }
//     let black = ({ width = 640, height = 480 } = {}) => {
//         let canvas = Object.assign(document.createElement("canvas"), { width, height })
//         canvas.getContext('2d').fillRect(0, 0, width, height)
//         let stream = canvas.captureStream()
//         return Object.assign(stream.getVideoTracks()[0], { enabled: false })
//     }

//     // let handleVideo = () => {
//     //     const next = !video;
//     //     setVideo(next);
//     //     try {
//     //         if (!window.localStream) return;

//     //         const currentVideoTracks = window.localStream.getVideoTracks();

//     //         const replaceVideoTrackForAllPeers = (newTrack) => {
//     //             for (let id in connections) {
//     //                 const pc = connections[id];
//     //                 if (!pc || !pc.getSenders) continue;
//     //                 const senders = pc.getSenders();
//     //                 const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
//     //                 if (videoSender && videoSender.replaceTrack) {
//     //                     videoSender.replaceTrack(newTrack || null).catch(() => {});
//     //                 } else if (newTrack) {
//     //                     try { pc.addTrack(newTrack, window.localStream); } catch (_) {}
//     //                 }
//     //             }
//     //         };

//     //         if (!next) {
//     //             // Turn OFF: stop sending video to peers and remove local track
//     //             const [track] = currentVideoTracks;
//     //             replaceVideoTrackForAllPeers(null);
//     //             if (track) {
//     //                 try { track.enabled = false; } catch (_) {}
//     //                 try { track.stop(); } catch (_) {}
//     //                 try { window.localStream.removeTrack(track); } catch (_) {}
//     //             }
//     //             if (localVideoref.current) {
//     //                 localVideoref.current.srcObject = window.localStream;
//     //             }
//     //         } else {
//     //             // Turn ON: acquire a fresh video track and replace for peers and preview
//     //             navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     //                 .then((media) => {
//     //                     const [newTrack] = media.getVideoTracks();
//     //                     if (!newTrack) return;
//     //                     // Replace track in stream rather than add to avoid duplicates
//     //                     const old = window.localStream.getVideoTracks()[0];
//     //                     if (old) {
//     //                         try { window.localStream.removeTrack(old); } catch (_) {}
//     //                         try { old.stop(); } catch (_) {}
//     //                     }
//     //                     try { window.localStream.addTrack(newTrack); } catch (_) {}
//     //                     if (localVideoref.current) {
//     //                         localVideoref.current.srcObject = window.localStream;
//     //                     }
//     //                     replaceVideoTrackForAllPeers(newTrack);
//     //                 })
//     //                 .catch((e) => console.log(e));
//     //         }
//     //     } catch (e) { console.log(e); }
//     // }


//     // let handleVideo = () => {
//     //     const next = !video;
//     //     setVideo(next);
//     //     try {
//     //         if (!window.localStream) return;
    
//     //         const currentVideoTracks = window.localStream.getVideoTracks();
    
//     //         const replaceVideoTrackForAllPeers = (newTrack) => {
//     //             for (let id in connections) {
//     //                 const pc = connections[id];
//     //                 if (!pc || !pc.getSenders) continue;
//     //                 const senders = pc.getSenders();
//     //                 const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
//     //                 if (videoSender && videoSender.replaceTrack) {
//     //                     videoSender.replaceTrack(newTrack || null).catch(() => {});
//     //                 } else if (newTrack) {
//     //                     try { pc.addTrack(newTrack, window.localStream); } catch (_) {}
//     //                 }
//     //             }
//     //         };
    
//     //         if (!next) {
//     //             // Turn OFF: stop sending video to peers and remove local track
//     //             const [track] = currentVideoTracks;
//     //             replaceVideoTrackForAllPeers(null);
//     //             if (track) {
//     //                 try { track.enabled = false; } catch (_) {}
//     //                 try { track.stop(); } catch (_) {}
//     //                 try { window.localStream.removeTrack(track); } catch (_) {}
//     //             }
//     //             // Add a black video track to the local stream to show a blank screen
//     //             const blackVideoTrack = black();
//     //             window.localStream.addTrack(blackVideoTrack);
    
//     //             if (localVideoref.current) {
//     //                 localVideoref.current.srcObject = window.localStream;
//     //             }
//     //         } else {
//     //             // Turn ON: acquire a fresh video track and replace for peers and preview
//     //             navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     //                 .then((media) => {
//     //                     const [newTrack] = media.getVideoTracks();
//     //                     if (!newTrack) return;
//     //                     // Replace track in stream rather than add to avoid duplicates
//     //                     const old = window.localStream.getVideoTracks()[0];
//     //                     if (old) {
//     //                         try { window.localStream.removeTrack(old); } catch (_) {}
//     //                         try { old.stop(); } catch (_) {}
//     //                     }
//     //                     try { window.localStream.addTrack(newTrack); } catch (_) {}
//     //                     if (localVideoref.current) {
//     //                         localVideoref.current.srcObject = window.localStream;
//     //                     }
//     //                     replaceVideoTrackForAllPeers(newTrack);
//     //                 })
//     //                 .catch((e) => console.log(e));
//     //         }
//     //     } catch (e) { console.log(e); }
//     // }
//     // let handleVideo = () => {
//     //     const next = !video;
//     //     setVideo(next);
    
//     //     try {
//     //         if (!window.localStream) return;
    
//     //         const currentVideoTracks = window.localStream.getVideoTracks();
//     //         const oldTrack = currentVideoTracks[0];
    
//     //         if (!next) {
//     //             // Video is being turned OFF
//     //             if (oldTrack) {
//     //                 // Remove the old track from the local stream
//     //                 window.localStream.removeTrack(oldTrack);
//     //                 // Stop the old track to release the camera
//     //                 oldTrack.stop();
//     //             }
    
//     //             // Create a new black video track and add it to the stream
//     //             const blackVideoTrack = black();
//     //             window.localStream.addTrack(blackVideoTrack);
                
//     //             // Update the local video ref with the new stream
//     //             if (localVideoref.current) {
//     //                 localVideoref.current.srcObject = window.localStream;
//     //             }
    
//     //             // Replace the track for all peers with a null track to stop transmission
//     //             for (let id in connections) {
//     //                 const pc = connections[id];
//     //                 if (pc && pc.getSenders) {
//     //                     const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
//     //                     if (videoSender) {
//     //                         videoSender.replaceTrack(null).catch(() => {});
//     //                     }
//     //                 }
//     //             }
//     //         } else {
//     //             // Video is being turned ON
//     //             // Get a new media stream with video
//     //             navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//     //                 .then((media) => {
//     //                     const [newTrack] = media.getVideoTracks();
//     //                     if (!newTrack) return;
    
//     //                     // Remove the current (black) video track from the local stream
//     //                     const currentVideoTracks = window.localStream.getVideoTracks();
//     //                     const blackTrack = currentVideoTracks[0];
//     //                     if (blackTrack) {
//     //                         window.localStream.removeTrack(blackTrack);
//     //                         blackTrack.stop();
//     //                     }
    
//     //                     // Add the new camera track to the stream
//     //                     window.localStream.addTrack(newTrack);
    
//     //                     // Update the local video ref
//     //                     if (localVideoref.current) {
//     //                         localVideoref.current.srcObject = window.localStream;
//     //                     }
                        
//     //                     // Replace the track for all peers
//     //                     for (let id in connections) {
//     //                         const pc = connections[id];
//     //                         if (pc && pc.getSenders) {
//     //                             const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
//     //                             if (videoSender) {
//     //                                 videoSender.replaceTrack(newTrack).catch(() => {});
//     //                             } else {
//     //                                 // If no sender exists, add the track
//     //                                 pc.addTrack(newTrack, window.localStream);
//     //                             }
//     //                         }
//     //                     }
//     //                 })
//     //                 .catch((e) => console.log(e));
//     //         }
//     //     } catch (e) {
//     //         console.log(e);
//     //     }
//     // };

//     let handleVideo = () => {
//         const next = !video;
//         setVideo(next);
      
//         try {
//           if (!window.localStream) return;
      
//           if (!next) {
//             // Video is being turned OFF
//             const currentVideoTracks = window.localStream.getVideoTracks();
//             const oldTrack = currentVideoTracks[0];
      
//             if (oldTrack) {
//               // Stop the track to release the camera
//               oldTrack.stop();
//               // Remove the track from the local stream
//               window.localStream.removeTrack(oldTrack);
//             }
            
//             // Explicitly set the srcObject to null to stop playback
//             if (localVideoref.current) {
//               localVideoref.current.srcObject = null;
//             }
            
//             // Update peers to stop sending video
//             for (let id in connections) {
//               const pc = connections[id];
//               if (pc && pc.getSenders) {
//                 const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
//                 if (videoSender) {
//                   videoSender.replaceTrack(null).catch(() => {});
//                 }
//               }
//             }
      
//           } else {
//             // Video is being turned ON
//             // Get a new media stream with video
//             navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//               .then((media) => {
//                 const [newTrack] = media.getVideoTracks();
//                 if (!newTrack) return;
      
//                 // Add the new camera track to the stream
//                 window.localStream.addTrack(newTrack);
      
//                 // Update the local video ref
//                 if (localVideoref.current) {
//                   localVideoref.current.srcObject = window.localStream;
//                 }
                
//                 // Replace the track for all peers
//                 for (let id in connections) {
//                   const pc = connections[id];
//                   if (pc && pc.getSenders) {
//                     const videoSender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
//                     if (videoSender) {
//                       videoSender.replaceTrack(newTrack).catch(() => {});
//                     } else {
//                       pc.addTrack(newTrack, window.localStream);
//                     }
//                   }
//                 }
//               })
//               .catch((e) => console.log(e));
//           }
//         } catch (e) {
//           console.log(e);
//         }
//       };


//     let handleAudio = () => {
//         const next = !audio;
//         setAudio(next)
//         try {
//             if (!window.localStream) return;
//             const [track] = window.localStream.getAudioTracks();
//             if (!track) return;
//             track.enabled = next;
//             // Ensure sender track state is in sync (not strictly necessary if just enabling/disabling)
//             for (let id in connections) {
//                 const pc = connections[id];
//                 if (!pc) continue;
//                 const senders = pc.getSenders ? pc.getSenders() : [];
//                 let audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
//                 if (audioSender && audioSender.replaceTrack) {
//                     audioSender.replaceTrack(track).catch(() => {});
//                 }
//             }
//         } catch (e) { console.log(e); }
//     }

//     useEffect(() => {
//         if (screen !== undefined) {
//             getDislayMedia();
//         }
//     }, [screen])
//     let handleScreen = () => {
//         setScreen(!screen);
//     }

//     let handleEndCall = () => {
//         try {
//             let tracks = localVideoref.current.srcObject.getTracks()
//             tracks.forEach(track => track.stop())
//         } catch (e) { }
//         window.location.href = "/"
//     }

//     let openChat = () => {
//         setModal(true);
//         setNewMessages(0);
//     }
//     let closeChat = () => {
//         setModal(false);
//     }
//     let handleMessage = (e) => {
//         setMessage(e.target.value);
//     }

//     const addMessage = (data, sender, socketIdSender) => {
//         setMessages((prevMessages) => [
//             ...prevMessages,
//             { sender: sender, data: data }
//         ]);
//         if (socketIdSender !== socketIdRef.current) {
//             setNewMessages((prevNewMessages) => prevNewMessages + 1);
//         }
//     };



//     let sendMessage = () => {
//         console.log(socketRef.current);
//         socketRef.current.emit('chat-message', message, username)
//         setMessage("");

//         // this.setState({ message: "", sender: username })
//     }

    
//     let connect = () => {
//         setAskForUsername(false);
//         getMedia();
//     }


//     return (
//         <div>

//             {askForUsername === true ?

//                 <Box sx={{
//                     minHeight: '100vh',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     p: { xs: 2, sm: 3 },
//                     background: 'linear-gradient(135deg, #0f1020 0%, #1b1c36 50%, #2a1f4a 100%)'
//                 }}>
//                     <Box sx={{
//                         width: '100%',
//                         maxWidth: 1100,
//                         display: 'grid',
//                         gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
//                         gap: { xs: 2, sm: 3 },
//                         alignItems: 'stretch'
//                     }}>
//                         <Paper elevation={0} sx={{
//                             p: { xs: 2, sm: 3 },
//                             bgcolor: 'rgba(255,255,255,0.08)',
//                             border: '1px solid rgba(255,255,255,0.12)',
//                             borderRadius: 3,
//                             backdropFilter: 'blur(10px)',
//                             display: 'flex',
//                             flexDirection: 'column',
//                             justifyContent: 'center'
//                         }}>
//                             <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 2 }}>
//                                 Enter the Lobby
//                             </Typography>
//                             <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
//                                 Choose a display name and preview your camera before joining.
//                             </Typography>
//                             <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
//                                 <TextField
//                                     id="outlined-basic"
//                                     label="Username"
//                                     value={username}
//                                     onChange={e => setUsername(e.target.value)}
//                                     variant="outlined"
//                                     fullWidth
//                                     sx={{
//                                         bgcolor: 'rgba(255,255,255,0.08)',
//                                         borderRadius: 2
//                                     }}
//                                 />
//                                 <Button variant="contained" size="large" onClick={connect} sx={{ px: 3 }}>
//                                     Connect
//                                 </Button>
//                             </Stack>
//                         </Paper>

//                         <Paper elevation={0} sx={{
//                             p: 1.5,
//                             bgcolor: 'rgba(255,255,255,0.08)',
//                             border: '1px solid rgba(255,255,255,0.12)',
//                             borderRadius: 3,
//                             backdropFilter: 'blur(10px)',
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                         }}>
//                             <Box
//                                 component="video"
//                                 ref={localVideoref}
//                                 autoPlay
//                                 muted
//                                 sx={{
//                                     width: '100%',
//                                     aspectRatio: '16 / 9',
//                                     bgcolor: 'black',
//                                     borderRadius: 2,
//                                     boxShadow: '0 12px 30px rgba(0,0,0,0.35)'
//                                 }}
//                             />
//                         </Paper>
//                     </Box>
//                 </Box> :


//                 <div className={styles.meetVideoContainer}>

//                     {showModal ? <div className={styles.chatRoom}>

//                         <div className={styles.chatContainer}>
//                             <h1>Chat</h1>

//                             <div className={styles.chattingDisplay}>

//                                 {messages.length !== 0 ? messages.map((item, index) => {

//                                     console.log(messages)
//                                     return (
//                                         <div style={{ marginBottom: "20px" }} key={index}>
//                                             <p style={{ fontWeight: "bold" }}>{item.sender}</p>
//                                             <p>{item.data}</p>
//                                         </div>
//                                     )
//                                 }) : <p>No Messages Yet</p>}


//                             </div>

//                             <div className={styles.chattingArea}>
//                                 <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
//                                 <Button variant='contained' onClick={sendMessage}>Send</Button>
//                             </div>


//                         </div>
//                     </div> : <></>}


//                     <div className={styles.buttonContainers}>
//                         <IconButton onClick={handleVideo} style={{ color: "white" }}>
//                             {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
//                         </IconButton>
//                         <IconButton onClick={handleEndCall} style={{ color: "red" }}>
//                             <CallEndIcon  />
//                         </IconButton>
//                         <IconButton onClick={handleAudio} style={{ color: "white" }}>
//                             {audio === true ? <MicIcon /> : <MicOffIcon />}
//                         </IconButton>

//                         {screenAvailable === true ?
//                             <IconButton onClick={handleScreen} style={{ color: "white" }}>
//                                 {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
//                             </IconButton> : <></>}

//                         <Badge badgeContent={newMessages} max={999} color='orange'>
//                             <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
//                                 <ChatIcon />                        </IconButton>
//                         </Badge>

//                     </div>


//                     <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

//                     <div className={styles.conferenceView}>
//                         {videos.map((video) => (
//                             <div key={video.socketId}>
//                                 <video

//                                     data-socket={video.socketId}
//                                     ref={ref => {
//                                         if (ref && video.stream) {
//                                             ref.srcObject = video.stream;
//                                         }
//                                     }}
//                                     autoPlay
//                                 >
//                                 </video>
//                             </div>

//                         ))}

//                     </div>

//                 </div>

//             }

//         </div>
//     )
// }
