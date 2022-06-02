import React from 'react';
import { useState } from "react"
import * as GiIcons from 'react-icons/gi';
import * as AiIcons from 'react-icons/ai';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  // {
  //   title: 'FileUpload',
  //   path: 'FileUpload',
  //   icon: <AiIcons.AiFillHome />,
  //   cName: 'nav-text'
  // },
  {
    title: 'Character Creation',
    path: 'character',
    icon: <GiIcons.GiCharacter />,
    cName: 'nav-text'
  },
  {
    title: 'Display Character',
    path: 'display',
    icon: <GiIcons.GiAbstract042 />,
    cName: 'nav-text'
  },
  {
    title: 'Spell',
    path: '/spells',
    icon: <GiIcons.GiCrystalWand />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Test',
  //   path: '/test',
  //   icon: <GiIcons.GiCrystalWand />,
  //   cName: 'nav-text'
  // }
];
