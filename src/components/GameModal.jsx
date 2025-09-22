import { useContext, useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { ImRedo } from "react-icons/im";
import { ImEnlarge2 } from "react-icons/im";
import { ImShrink2 } from "react-icons/im";
import { ImNewTab } from "react-icons/im";
import DivLoading from "./DivLoading";

const GameModal = (props) => {
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 767;
    };
    
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (isMobile) {
        window.location.href = props.gameUrl;
      } else {
        document
          .getElementsByClassName("game-window")[0]
          .classList.remove("d-none");
        setUrl(props.gameUrl);
      }
    }
  }, [props.gameUrl, isMobile]);

  const closeModal = () => {
    resetModal();
    document.getElementsByClassName("game-window")[0].classList.add("d-none");
    if (props.onClose) {
      props.onClose();
    }
  };

  const reload = () => {
    resetModal();
    props.reload();
  };

  const resetModal = () => {
    setUrl(null);
    setIframeLoaded(false);
    document.getElementById("game-window-iframe").classList.add("d-none");
  };

  const toggleFullScreen = () => {
    const gameWindow = document.getElementsByClassName("game-window")[0];
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (gameWindow.requestFullscreen) {
        gameWindow.requestFullscreen();
      } else if (gameWindow.mozRequestFullScreen) {
        gameWindow.mozRequestFullScreen();
      } else if (gameWindow.webkitRequestFullscreen) {
        gameWindow.webkitRequestFullscreen();
      } else if (gameWindow.msRequestFullscreen) {
        gameWindow.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
      document
        .getElementsByClassName("game-window")[0]
        .classList.remove("fullscreen");
    }
  };

  useEffect(() => {
    // Add event listeners for fullscreen change
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      // Clean up event listeners
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const launchInNewTab = () => {
    props.launchInNewTab();
    resetModal();
  };

  const handleIframeLoad = () => {
    if (url != null) {
      document.getElementById("game-window-iframe").classList.remove("d-none");
      setIframeLoaded(true);
    }
  };

  const handleIframeError = () => {
    props.setMessageCustomAlert([
      "error",
      "Se produjo un error al cargar el juego, contacte al administrador.",
    ]);
  };

  useEffect(() => {
    var w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName("body")[0],
      width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
      height =
        w.innerHeight || documentElement.clientHeight || body.clientHeight;

    // mobile
    if (width <= 767) {
      document
        .getElementsByClassName("game-window")[0]
        .classList.add("portrait");
    }
    // desktop
    else {
      document
        .getElementsByClassName("game-window")[0]
        .classList.add("landscape");
    }
  }, []);

  if (isMobile) {
    return null;
  }

  return (
    <>
      <div className="d-none game-window">
        <div className="game-window-header">
          <div className="game-window-header-item align-center close-window">
            <span className="close-button" onClick={closeModal} title="Close">
              <ImCross />
            </span>
          </div>
          <div className="game-window-header-item align-center reload-window">
            <span className="icon-reload" onClick={reload} title="Reload">
              <ImRedo />
            </span>
          </div>
          <div className="game-window-header-item align-center full-window">
            {isFullscreen ? (
              <span
                className="icon-originscreen"
                onClick={toggleFullScreen}
                title="Exit Fullscreen"
              >
                <ImShrink2 />
              </span>
            ) : (
              <span
                className="icon-fullscreen"
                onClick={toggleFullScreen}
                title="Fullscreen"
              >
                <ImEnlarge2 />
              </span>
            )}
          </div>
          <div className="game-window-header-item align-center new-window">
            <span
              className="icon-new-window"
              onClick={launchInNewTab}
              title="Open In New Window"
            >
              <ImNewTab />
            </span>
          </div>
        </div>

        {iframeLoaded == false && (
          <div
            id="game-window-loading"
            className="game-window-iframe-wrapper"
          >
            <DivLoading />
          </div>
        )}

        <div
          id="game-window-iframe"
          className="game-window-iframe-wrapper d-none"
        >
          <iframe
            allow="camera;microphone;fullscreen *"
            src={url}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default GameModal;