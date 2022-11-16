import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StackSwitcher } from './navigation/StackSwitcher';

export default function App() {
  return (
    <Provider store={store}>
      <StackSwitcher />
    </Provider>
  );
}

