'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {TokenizedText} from '../../commons-node/tokenizedText-rpc-types';

export type OutlineTree = {
  // Must be one or the other. If both are present, tokenizedText is preferred.
  plainText?: string,
  tokenizedText?: TokenizedText,
  representativeName?: string,

  startPosition: atom$Point,
  endPosition?: atom$Point,
  children: Array<OutlineTree>,
};

export type Outline = {
  outlineTrees: Array<OutlineTree>,
};
