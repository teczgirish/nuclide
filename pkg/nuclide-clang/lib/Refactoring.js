'use babel';
/* @flow */

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import type {
  RefactoringsResponse,
  RefactorRequest,
  RefactorResponse,
} from './refactoring-api';

import invariant from 'assert';
import {trackTiming} from '../../nuclide-analytics';
import {getDiagnostics, getDeclarationInfo, getLocalReferences} from './libclang';

const SUPPORTED_CURSORS = new Set(['VAR_DECL', 'PARM_DECL']);

async function checkDiagnostics(editor: atom$TextEditor): Promise<boolean> {
  // Don't allow refactoring if there are any warnings or errors.
  const diagnostics = await getDiagnostics(editor);
  return (
    diagnostics != null &&
    diagnostics.accurateFlags === true &&
    diagnostics.diagnostics.length === 0
  );
}

export default class RefactoringHelpers {

  @trackTiming('nuclide-clang:refactoringsAtPoint')
  static async refactoringsAtPoint(
    editor: atom$TextEditor,
    point: atom$Point,
  ): Promise<Array<RefactoringsResponse>> {
    const path = editor.getPath();
    if (path == null || !(await checkDiagnostics(editor))) {
      return [];
    }

    const {row, column} = point;
    const declInfo = await getDeclarationInfo(editor, row, column);
    if (declInfo == null || !SUPPORTED_CURSORS.has(declInfo[0].type)) {
      return [];
    }

    return [{
      kind: 'rename',
      symbolAtPoint: {
        name: declInfo[0].name,
        range: declInfo[0].extent,
      },
    }];
  }

  // TODO(hansonw): Move this to the clang-rpc service.
  @trackTiming('nuclide-clang:refactor')
  static async refactor(request: RefactorRequest): Promise<?RefactorResponse> {
    invariant(request.kind === 'rename');
    const {editor, point, newName} = request;
    const path = editor.getPath();
    if (path == null || !(await checkDiagnostics(editor))) {
      return null;
    }

    // TODO(hansonw): We should disallow renames that conflict with an existing variable.
    const refs = await getLocalReferences(editor, point.row, point.column);
    if (refs == null) {
      return null;
    }

    // TODO(hansonw): Apply clang-format.
    const edits = refs.references.map(ref => ({
      oldRange: ref,
      oldText: refs.cursor_name,
      newText: newName,
    }));

    return {
      edits: new Map([[path, edits]]),
    };
  }

}
