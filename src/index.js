import { h, Component, createContext } from "preact";
import { Router } from "preact-router";
import { Link } from "preact-router/match";
import ReactGA from "react-ga";

import "tailwindcss/dist/tailwind.min.css";

// Routes
import Home from "./routes/home.js";
import Form from "./routes/form.js";
import FormSuccess from './routes/formSuccess';
import Category from "./routes/category";


// Components
import { Dialog } from "./components/dialog.js";
import { Loader } from "./components/Loader";

export const Action = createContext({});

// stubs
// import resultsMock from "./assets/formigineDomicilio_old.json";

import SETTINGS from "./settings.json";

import { isClient, isProd } from "./utils";

let PWAPrompt = null;
if (isClient) {
   PWAPrompt = require("react-ios-pwa-prompt").default;
}

if (isProd) {
   ReactGA.initialize(process.env.PREACT_APP_GA_TRACKING_ID);
   // ReactGA.initialize("UA-162041363-1", { debug: true });
}

export default class App extends Component {
   state = {
      loading: true,
      error: false,
      results: {},
      isHomepage: true,
      isPopupOpen: false,
      popupNumbers: [],
   };

   handleRoute = (e) => {
      this.currentUrl = e.url;
      this.setState({ isHomepage: e.url.replace(/\?.*/g, "") === "/" });
   };

   setPopupNumbers = (e, numberArray) => {
      e.preventDefault();

      this.setState({
         popupNumbers: numberArray,
         isPopupOpen: true,
      });
   };

   closePopup = (e) => {
      if (e.currentTarget === e.target) {
         this.setState({ isPopupOpen: false });
      }
   };

   componentDidMount() {
      if (isProd) {
         ReactGA.pageview(window.location.pathname + window.location.search);
      }
      fetch(`${SETTINGS.PREACT_APP_DATA_SOURCE}`)
         .then((r) => r.json())
         .then((json) => {
            this.setState({
               loading: false,
               results: json,
               resultBkp: json,
            });
         })
         .catch(() => {
            this.setState({
               loading: false,
               error: true,
            });
         });
   }

   componentDidUpdate() {
      const { isPopupOpen } = this.state;

      const root = document.documentElement;
      root.style.setProperty(
         "--popup-visible",
         isPopupOpen ? "hidden" : "initial"
      );
   }

   render(
      props,
      { isHomepage, results, popupNumbers, isPopupOpen, loading, error }
   ) {
      if (loading)
         return (
            <div class="w-full h-screen flex items-center justify-center">
               <Loader />
            </div>
         );
      if (error)
         return (
            <div class="w-full h-screen flex items-center justify-center">
               <div
                  class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
               >
                  <strong class="font-bold">Ops! </strong>
                  <span class="block sm:inline">
                     Qualcosa è andato storto, riprova.
                  </span>
               </div>
            </div>
         );

      return (
         <Action.Provider value={{ setPopupNumbers: this.setPopupNumbers }}>
            <div id="app" class="px-5 max-w-screen-md mx-auto">
               <nav class="flex justify-center md:justify-end items-center">
                  {isHomepage ? null : (
                     <Link
                        class="m-2 ml-0 my-5 md:m-5 text-blue-500 hover:text-blue-800 text-sm md:text-base"
                        href="/"
                     >
                        Ritorna alla home
                     </Link>
                  )}
                  <Link
                     class="m-2 my-5 md:m-5 mr-0 bg-blue-500 inline-block hover:bg-blue-700 text-white font-bold text-xs md:text-base px-2 py-1 rounded"
                     href="/form"
                  >
                     Aggiungi un'attività
                  </Link>
               </nav>
               <Link href="/">
                  <h1 class="font-sans text-4xl md:text-5xl lg:text-6xl pt-10 text-gray-800 text-center capitalize">
                     <span
                        class="block sm:inline-block"
                        role="img"
                        aria-label="biker"
                     >
                        🚴
                     </span>
                     {`${SETTINGS.PREACT_APP_CITY} a Domicilio`}
                  </h1>
               </Link>
               <Router onChange={this.handleRoute}>
                  <Home path="/" results={results} />
                  <Form path="/form" />
                  <FormSuccess path="/form/success" />
                  <Category path="categorie/:category" results={results} />
               </Router>
            </div>
            <Dialog
               isOpen={isPopupOpen}
               closePopup={this.closePopup}
               telNumbers={popupNumbers}
            />
            {PWAPrompt && (
               <PWAPrompt
                  timesToShow={3}
                  // debug={true}
                  permanentlyHideOnDismiss={false}
                  copyTitle="Sono un'app!"
                  copyBody="Aggiungimi alla home per utilizzarmi in fullscreen e offline. Così appena vorrai ordinare mi avrai a portata!"
                  copyShareButtonLabel="Fai tap sul bottone condividi"
                  copyAddHomeButtonLabel="Fai sulla voce 'Aggiungi a Home'"
               />
            )}
         </Action.Provider>
      );
   }
}
