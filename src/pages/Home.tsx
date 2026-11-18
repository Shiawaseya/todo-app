import {
  IonApp,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { home, calendar, person, informationCircle } from "ionicons/icons";
import HomeTab from "../components/home-tab";
import CalendarTab from "../components/calendar-tab";
import ProfileTab from "../components/about_tab";
import './Home.css';
import AboutTab from "../components/about_tab";

export default function Home() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tab/home">
              <HomeTab />
            </Route>
            <Route exact path="/tab/calendar">
              <CalendarTab />
            </Route>
            <Route exact path="/tab/about">
              <AboutTab />
            </Route>
            <Route exact path="/">
              <Redirect to="/tab/home" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/tab/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="calendar" href="/tab/calendar">
              <IonIcon icon={calendar} />
              <IonLabel>Calendar</IonLabel>
            </IonTabButton>
            <IonTabButton tab="about" href="/tab/about">
              <IonIcon icon={informationCircle} />
              <IonLabel>About</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}
