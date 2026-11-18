import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';
import { initStorage } from './storage';
import { scheduleNotifications } from './notification';
import { useActivities } from './hooks/useActivities';
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

setupIonicReact();

const App: React.FC = () => {
  const { data: activities = [] } = useActivities();
  
  useEffect(() => {
    initStorage();
  }, []);

  useEffect(() => {
    if (activities.length > 0) {
      scheduleNotifications(activities);
    }
  }, [activities]);
  const getScheduledNotifications = async () => {
    const { notifications } = await LocalNotifications.getPending();
    console.log(notifications);
    return notifications;
  };
  getScheduledNotifications()
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/tab">
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
