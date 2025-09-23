// import LazyLoad from "react-lazyload";
import { useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import IconPlay from "/src/assets/svg/play.svg";
import IconFavorite from "/src/assets/svg/favorite.svg";

const GameCard = (props) => {
  const imgRef = useRef(null);

  const imageLoaded = () => {
    // console.log(imgRef.current);
    // imgRef.current?.classList.remove("d-none");
    document
      .getElementById("game-card-img-" + props.id)
      .classList.add("fade-in");

    document
      .getElementById("game-card-img-" + props.id)
      .classList.remove("visibility-hidden");
  };

  const imageError = () => {
    document
      .getElementById("game-card-img-" + props.id)
      .setAttribute("src", "/src/assets/img/no-image.jpg");
  };

  return (
    <a className="game-card_gameCard game-card_sm games-cards-suspensed_gameCardClassName" onClick={props.onClick}>
      <span className="game-card_gameCardInner">
        <span className="game-card_gameCardWidthKeeper"></span>
        <img className="game-card_gameCardImage" width={200} height={200} src={props.imageSrc} alt={props.title} loading="lazy" />
        <div className="game-card_gameCardInnerOverlay">
          <span className="game-card-content_gameCardContent game-card_gameCardContent">
            <div className="game-card-content_gameCardContentLabel">{props.title}</div>
            <span className="game-card-content_gameCardContentInner game-card_gameCardPlayContentInner">
              <button className="button_button button_zeusPrimary button_xs game-card-content_gameCardPlayButton">Play</button>
            </span>
          </span>
        </div>
      </span>
    </a>
  );
};

export default GameCard;
