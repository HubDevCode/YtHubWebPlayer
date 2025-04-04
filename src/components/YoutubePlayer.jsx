import React, { useState, useEffect } from 'react';

const YoutubePlayer = () => {
    const [playlist, setPlaylist] = useState([
        { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
        { id: 'y6120QOlsfU', title: 'Darude - Sandstorm' },
        { id: 'fJ9rUzIMcZQ', title: 'Queen - Bohemian Rhapsody' },
        { id: 'ZbZSe6N_BXs', title: 'Pharrell Williams - Happy' },
        { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito ft. Daddy Yankee' }
    ]);

    const [currentTrack, setCurrentTrack] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [customUrl, setCustomUrl] = useState('');
    const [customTitle, setCustomTitle] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    // Stato per il download
    const [downloadStatus, setDownloadStatus] = useState({
        isLoading: false,
        progress: 0,
        success: null,
        error: null,
        downloadUrl: null
    });

    const handleTrackSelect = (track) => {
        setCurrentTrack(track);
        setIsPlaying(true);
    };

    const handleAddCustomTrack = () => {
        if (customUrl && customTitle) {
            // Estrai ID video dall'URL di YouTube
            let videoId = customUrl;

            if (customUrl.includes('youtube.com/watch?v=')) {
                videoId = customUrl.split('v=')[1];
                const ampersandPosition = videoId.indexOf('&');
                if (ampersandPosition !== -1) {
                    videoId = videoId.substring(0, ampersandPosition);
                }
            } else if (customUrl.includes('youtu.be/')) {
                videoId = customUrl.split('youtu.be/')[1];
            }

            const newTrack = { id: videoId, title: customTitle };
            setPlaylist([...playlist, newTrack]);
            setCustomUrl('');
            setCustomTitle('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredPlaylist = playlist.filter(track =>
        track.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveTrack = (indexToRemove) => {
        const updatedPlaylist = playlist.filter((_, index) => index !== indexToRemove);
        setPlaylist(updatedPlaylist);

        // Se la traccia corrente viene rimossa, ferma la riproduzione
        if (currentTrack && playlist[indexToRemove].id === currentTrack.id) {
            setCurrentTrack(null);
            setIsPlaying(false);
        }
    };

    // Funzione per gestire il download direttamente dall'app
    const handleDownload = async (format, videoId, title) => {
        // Reset dello stato di download
        setDownloadStatus({
            isLoading: true,
            progress: 0,
            success: null,
            error: null,
            downloadUrl: null
        });

        const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_');

        try {
            // Fase 1: Avvio della conversione (simulata con un progresso)
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                if (progress <= 50) {
                    setDownloadStatus(prev => ({
                        ...prev,
                        progress: progress
                    }));
                }
            }, 200);

            // Simula chiamata API per convertire il video
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Fase 2: Preparazione del file per il download
            clearInterval(progressInterval);

            // Simula ottenimento dell'URL di download
            const downloadAPI = `https://backend.tuo-servizio.com/api/convert?videoId=${videoId}&format=${format}`;

            // In un'implementazione reale, qui faresti una fetch all'API
            // In questa simulazione, generiamo un URL fittizio per il download
            await new Promise(resolve => {
                let downloadProgress = 50;
                const downloadProgressInterval = setInterval(() => {
                    downloadProgress += 5;
                    if (downloadProgress <= 95) {
                        setDownloadStatus(prev => ({
                            ...prev,
                            progress: downloadProgress
                        }));
                    } else {
                        clearInterval(downloadProgressInterval);
                        resolve();
                    }
                }, 200);
            });

            // URL generato dalla tua API (in questo caso simulato)
            // Nella realtà, questa sarebbe la risposta dell'API con l'URL del file
            const downloadUrl = format === 'mp3'
                ? `https://tuo-bucket-s3.esempio.com/downloads/${videoId}.mp3`
                : `https://tuo-bucket-s3.esempio.com/downloads/${videoId}.mp4`;

            // Imposta lo stato di successo con l'URL di download
            setDownloadStatus({
                isLoading: false,
                progress: 100,
                success: true,
                error: null,
                downloadUrl: downloadUrl
            });

            // Inizia il download diretto del file
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = format === 'mp3'
                ? `${safeTitle}.mp3`
                : `${safeTitle}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error("Errore durante il download:", error);
            setDownloadStatus({
                isLoading: false,
                progress: 100,
                success: false,
                error: "Errore nel processo di download. Riprova più tardi.",
                downloadUrl: null
            });
        }
    };

    // Resetta lo stato di download dopo 5 secondi in caso di errore o successo
    useEffect(() => {
        if (downloadStatus.success !== null) {
            const timer = setTimeout(() => {
                setDownloadStatus({
                    isLoading: false,
                    progress: 0,
                    success: null,
                    error: null,
                    downloadUrl: null
                });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [downloadStatus.success]);

    // Stili CSS
    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        },
        header: {
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333'
        },
        playerSection: {
            marginBottom: '25px',
            width: '100%'
        },
        emptyPlayer: {
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '16px'
        },
        videoContainer: {
            position: 'relative',
            paddingTop: '56.25%', // Aspect ratio 16:9
            height: '0',
            marginBottom: '10px'
        },
        iframe: {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '8px'
        },
        trackInfo: {
            textAlign: 'center',
            marginTop: '10px'
        },
        trackTitle: {
            fontSize: '18px',
            fontWeight: '600'
        },
        button: {
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            margin: '5px',
            fontWeight: '500'
        },
        playButton: {
            backgroundColor: '#4a90e2'
        },
        removeButton: {
            backgroundColor: '#e74c3c'
        },
        addButton: {
            backgroundColor: '#2ecc71',
            padding: '10px 20px',
            fontSize: '15px',
            marginTop: '10px'
        },
        addSection: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '25px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#333'
        },
        input: {
            width: '100%',
            padding: '10px',
            margin: '5px 0',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
        },
        playlistSection: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        },
        playlistHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px'
        },
        searchInput: {
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            width: '250px',
            fontSize: '14px'
        },
        trackItem: {
            padding: '12px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #eee'
        },
        trackTitle: {
            cursor: 'pointer',
            textAlign: 'left',
            flexGrow: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            paddingRight: '10px'
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px'
        },
        emptyPlaylist: {
            padding: '20px 0',
            textAlign: 'center',
            color: '#777'
        },
        // Stili per la barra di progresso
        progressContainer: {
            marginTop: '15px',
            width: '100%',
            height: '20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '10px',
            overflow: 'hidden',
            opacity: downloadStatus.isLoading || downloadStatus.success !== null ? 1 : 0,
            transition: 'opacity 0.3s ease'
        },
        progressBar: {
            height: '100%',
            borderRadius: '10px',
            transition: 'width 0.3s ease, background-color 0.3s ease',
            width: `${downloadStatus.progress}%`,
            backgroundColor: downloadStatus.success === true
                ? '#2ecc71' // Verde per successo
                : downloadStatus.success === false
                    ? '#e74c3c' // Rosso per errore
                    : '#3498db' // Blu per caricamento
        },
        downloadMessage: {
            marginTop: '10px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: downloadStatus.isLoading || downloadStatus.success !== null ? 'block' : 'none',
            color: downloadStatus.success === true
                ? '#2ecc71'
                : downloadStatus.success === false
                    ? '#e74c3c'
                    : '#3498db'
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Lettore Musicale YouTube</h1>

            {/* Sezione Player */}
            <div style={styles.playerSection}>
                {currentTrack ? (
                    <div>
                        <div style={styles.videoContainer}>
                            <iframe
                                src={`https://www.youtube.com/embed/${currentTrack.id}?autoplay=${isPlaying ? 1 : 0}`}
                                style={styles.iframe}
                                title={currentTrack.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div style={styles.trackInfo}>
                            <h2 style={styles.trackTitle}>{currentTrack.title}</h2>
                            <div style={{ marginTop: '15px' }}>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    style={{ ...styles.button, ...styles.playButton }}
                                >
                                    {isPlaying ? 'Pausa' : 'Riproduci'}
                                </button>
                                <button
                                    onClick={() => handleDownload('mp3', currentTrack.id, currentTrack.title)}
                                    style={{ ...styles.button, backgroundColor: '#9b59b6' }}
                                    disabled={downloadStatus.isLoading}
                                >
                                    Scarica MP3
                                </button>
                                <button
                                    onClick={() => handleDownload('mp4', currentTrack.id, currentTrack.title)}
                                    style={{ ...styles.button, backgroundColor: '#3498db' }}
                                    disabled={downloadStatus.isLoading}
                                >
                                    Scarica MP4
                                </button>
                            </div>

                            {/* Barra di Progresso */}
                            <div style={styles.progressContainer}>
                                <div style={styles.progressBar}></div>
                            </div>

                            {/* Messaggio di download */}
                            <div style={styles.downloadMessage}>
                                {downloadStatus.isLoading
                                    ? `Download in corso: ${downloadStatus.progress}%`
                                    : downloadStatus.success
                                        ? "Download completato con successo!"
                                        : downloadStatus.error}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={styles.emptyPlayer}>
                        <p>Seleziona una canzone per iniziare</p>
                    </div>
                )}
            </div>

            {/* Aggiungi Brano Personalizzato */}
            <div style={styles.addSection}>
                <h2 style={styles.sectionTitle}>Aggiungi Brano</h2>
                <div>
                    <input
                        type="text"
                        placeholder="URL YouTube"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        style={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Titolo della canzone"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        style={styles.input}
                    />
                    <button
                        onClick={handleAddCustomTrack}
                        style={{ ...styles.button, ...styles.addButton }}
                    >
                        Aggiungi alla Playlist
                    </button>
                </div>
            </div>

            {/* Playlist */}
            <div style={styles.playlistSection}>
                <div style={styles.playlistHeader}>
                    <h2 style={styles.sectionTitle}>La Tua Playlist</h2>
                    <input
                        type="text"
                        placeholder="Cerca..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        style={styles.searchInput}
                    />
                </div>

                <div>
                    {filteredPlaylist.map((track, index) => (
                        <div key={index} style={styles.trackItem}>
                            <div
                                onClick={() => handleTrackSelect(track)}
                                style={styles.trackTitle}
                            >
                                {track.title}
                            </div>
                            <div style={styles.buttonGroup}>
                                <button
                                    onClick={() => handleTrackSelect(track)}
                                    style={{ ...styles.button, ...styles.playButton }}
                                >
                                    Riproduci
                                </button>
                                <button
                                    onClick={() => handleRemoveTrack(index)}
                                    style={{ ...styles.button, ...styles.removeButton }}
                                >
                                    Rimuovi
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredPlaylist.length === 0 && (
                        <div style={styles.emptyPlaylist}>
                            Nessun brano trovato
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YoutubePlayer;