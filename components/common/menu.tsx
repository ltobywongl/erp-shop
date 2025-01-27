"use client";

import { Menu, MenuProps } from "antd";
import React from "react";

export default function MyMenu(props: Readonly<MenuProps>) {
  return <Menu {...props} />;
}
