'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import {React} from 'react-for-atom';

export class ExampleGadgetB extends React.Component {

  getTitle(): string {
    return 'Example Gadget B';
  }

  getIconName(): atom$Octicon {
    return 'squirrel';
  }

  render(): React.Element<any> {
    return (
      <div className="pane-item padded nuclide-example-gadget">
          This gadget stores its state in the topmost React component.
      </div>
    );
  }

  serialize(): Object {
    return {deserializer: 'ExampleGadgetB'};
  }

}
