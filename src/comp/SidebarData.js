import React from 'react';
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Spells',
    path: '/spells',
    icon: <GiIcons.GiCrystalWand />,
    cName: 'nav-text'
  }
];