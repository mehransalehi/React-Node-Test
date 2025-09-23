import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/LayoutContext";
import { NavigationContext } from "../components/NavigationContext";
import { callApi, callApiService } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Slideshow";
import CategorySlideshow from "../components/CategorySlideshow";
import GameModal from "../components/GameModal";
import DivLoading from "../components/DivLoading";
import LoginModal from "../components/LoginModal";
import CustomAlert from "../components/CustomAlert";
import "animate.css";
import ImgBanner1 from "/src/assets/img/slots.avif";
import ImgBanner2 from "/src/assets/img/live-casino.avif";
import ImgBanner3 from "/src/assets/img/sport.avif";
import ImgLobby from "/src/assets/img/lobby.avif";
import ImgNew from "/src/assets/img/new.avif";
import ImgJokers from "/src/assets/img/jokers.avif";
import ImgHot from "/src/assets/img/hot.avif";
import ImgCrash from "/src/assets/img/crash.avif";
import IconAnimals from "/src/assets/svg/animals.svg";
import ImgMegaways from "/src/assets/img/megaways.avif";
import ImgRoulette from "/src/assets/img/roulette.webp";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let pageCurrent = 0;



const Home = () => {
  const pageTitle = "Home";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const [activeIndex, setActiveIndex] = useState(0);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const [selectedPage, setSelectedPage] = useState("lobby");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSlotsOnly, setIsSlotsOnly] = useState("");
  const [messageCustomAlert, setMessageCustomAlert] = useState(["", ""]);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const imageSlideshow = [ImgBanner1, ImgBanner2, ImgBanner3];

  const tags = [
    { name: "lobby", image: ImgLobby },
    { name: "new", image: ImgNew },
    { name: "jokers", image: ImgJokers },
    { name: "hot", image: ImgHot },
    { name: "crash games", image: ImgCrash },
    { name: "animals", image: IconAnimals },
    { name: "megaways", image: ImgMegaways },
    { name: "roulette", image: ImgRoulette }
  ];

  useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth <= 767;
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    setGameUrl("");
    setShouldShowGameModal(false);

    setSelectedPage("home");
    getPage("home");

    if (contextData.session != null) {
      getStatus();
    }
  }, [location.pathname]);

  useEffect(() => { }, [selectedPage]);

  const getStatus = () => {
    callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
  };

  const callbackGetStatus = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      contextData.slots_only = result && result.slots_only;
      setIsSlotsOnly(contextData.slots_only ? "true" : "false");
    }
  };

  const getPage = (page) => {
    setCategories([]);
    setGames([]);
    setSelectedPage(page);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      setCategories(result.data.categories);
      setPageData(result.data);

      if (pageData.url && pageData.url != null) {
        if (contextData.isMobile) {
          // Mobile sports workaround
        }
      } else {
        if (result.data.page_group_type == "categories") {
          setSelectedCategoryIndex(0);
        }
        if (result.data.page_group_type == "games") {
          loadMoreContent();
        }
      }
      pageCurrent = 0;
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      let item = categories[0];
      fetchContent(item, item.id, item.table_name, 0, false);
      setActiveCategory(item);
    }
  }, [categories]);

  const loadMoreContent = () => {
    let item = categories[selectedCategoryIndex];
    if (item) {
      fetchContent(item, item.id, item.table_name, selectedCategoryIndex, false);
    }
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    let pageSize = 30;
    setIsLoadingGames(true);
    // setShowFullDivLoading(true);

    if (resetCurrentPage == true) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    callApiService(
      contextData,
      "GET",
      "/games/?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize,
      callbackFetchContent,
      null
    );
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setMessageCustomAlert(["error", result.message]);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.data);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.data]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
    setShowFullDivLoading(false);
  };

  const configureImageSrc = (result) => {
    (result.data || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (id, type, launcher) => {
    setShowFullDivLoading(true);
    setShouldShowGameModal(true);
    selectedGameId = id != null ? id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else if (result.status == "500" || result.status == "422") {
      setMessageCustomAlert(["error", result.message]);
    }
    setShowFullDivLoading(false);
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleAlertClose = () => {
    setMessageCustomAlert(["", ""]);
  };

  return (
    <>
      <CustomAlert message={messageCustomAlert} onClose={handleAlertClose} />
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
        />
      ) : (
        <>
          <Slideshow images={imageSlideshow} />

          <div className="games-tags_gamesTags">
            <div className="games-tags_gamesTagsInner">
              {tags.map((tag, index) => (
                <button
                  key={index}
                  role="button"
                  onClick={() => setActiveIndex(index)}
                  className={`games-tags_gamesTag ${activeIndex === index ? "games-tags_active" : ""
                    }`}
                >
                  <span className="games-tags_tagIconWrapper">
                    <img
                      alt={tag.name}
                      loading="lazy"
                      width="46"
                      height="40"
                      src={tag.image}
                      style={{ color: "transparent" }}
                    />
                  </span>
                  <span className="games-tags_gameTagLabel">{tag.name}</span>
                </button>
              ))}
            </div>
          </div>

          {
            categories.length > 0 && <CategorySlideshow categories={categories} />
          }

          

          {/* <div className="providers-carousel_providersCarouselContainer__EQ3va">
            <div className="swiper swiper-initialized swiper-horizontal providers-carousel_swiper__ShIo0">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="providers-carousel_providerItem__pvG4o">
                    <div className="providers-carousel_providerItemIcon__l5OMp">
                      <img alt="provider-item-icon" loading="lazy" width="20" height="20" decoding="async" src="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <div className="slots-main-desktop">
            {firstFiveCategoriesGames.length > 0 && firstFiveCategoriesGames.map((categoryData, index) => (
              categoryData && categoryData.games && categoryData.games.length > 0 ? (
                <div key={index} className="slots-main-desktop">
                  <div className="provider-section-desktop">
                    <div className="provider-section-desktop">
                      <div className="provider-section-desktop">
                        <div className="provider-section-desktop">
                          <span className="provider-section-desktop">
                            {categoryData.category.name}
                          </span>
                        </div>
                        <div className="provider-section-desktop"></div>
                      </div>
                      <div className="provider-section-desktop">
                        <div className="carousel-arrows">
                          <a className="carousel-arrows" href="/casino">
                            <span className="carousel-arrows">Mostrar todo</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="provider-section-desktop">
                      {categoryData.games.slice(0, 8).map((game, gameIndex) => (
                        <GameCard
                          key={gameIndex}
                          id={game.id}
                          title={game.name}
                          imageSrc={game.imageDataSrc || game.image_url || (game.image_local ? contextData.cdnUrl + game.image_local : "")}
                          onClick={() =>
                            isLogin
                              ? launchGame(game.id, game.type, game.launcher)
                              : isMobile
                                ? navigate("/login")
                                : handleLoginClick()
                          }
                        />
                      ))}
                    </div>
                    {categoryData.games.length === 8 && (
                      <div className="carousel-arrows">
                        <a className="carousel-arrows" href={`/casino?category=${categoryData.category.id}`}>
                          <span className="carousel-arrows">Ver más {categoryData.category.name}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : null
            ))}

            {isLoadingGames && <DivLoading />}
          </div> */}
        </>
      )}
    </>
  );
};

export default Home;