import adamAvatarIcon from '../images/adam.jpg';
import jaquelineAvatarIcon from '../images/jaqueline.jpg';
import johnAvatarIcon from '../images/john.jpg';
import sarahAvatarIcon from '../images/sarah.jpg';

const colors = {
  accepted: '#4a7b2b',
  deleted: '#bc281e',
  rejected: '#ba772b',
  waitlist: '#296690',
};

const people = [
  {
    id: 0,
    name: 'John',
    info: "John's info",
    avatar: johnAvatarIcon,
    status: 'pending',
  },
  {
    id: 1,
    name: 'Sarah',
    info: "Sarah's info",
    avatar: sarahAvatarIcon,
    status: 'pending',
  },
  {
    id: 2,
    name: 'Adam',
    info: "Adam's info",
    avatar: adamAvatarIcon,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Jaqueline',
    info: "Jaqueline's info",
    avatar: jaquelineAvatarIcon,
    status: 'pending',
  },
];

export { colors, people };
