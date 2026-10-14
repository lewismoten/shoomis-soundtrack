import './runtime.js';
import './styles/standalone.css';
import { mountStandalonePlayer } from './player/standalone-player.js';

mountStandalonePlayer(document.querySelector('#standalone-player'));
