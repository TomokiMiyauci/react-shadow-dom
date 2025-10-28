import path from "node:path";
import ts from "typescript";

export default function dtsPlugin({ outDir = "dist" } = {}) {
  return {
    visitor: {
      Program(pathNode, state) {
        const inputFile = state.filename;
        if (!inputFile.endsWith(".ts") && !inputFile.endsWith(".tsx")) return;

        const program = ts.createProgram({
          rootNames: [inputFile],
          options: {
            declaration: true,
            emitDeclarationOnly: true,
            outDir,
            declarationMap: true,
            isolatedModules: true,
            strict: true,
          },
        });

        program.emit(undefined, undefined, undefined, undefined, transformer);

        const fileName = path.basename(inputFile);
        const dtsFile = path.join(
          outDir,
          fileName.replace(/\.(ts|tsx)$/, ".d.ts"),
        );
        pathNode.addComment(
          "leading",
          ` @ts-self-types="./${path.basename(dtsFile)}"`,
          true,
        );
      },
    },
  };
}

/**
 * Dts re-export specifier rewriter.
 * @see https://github.com/microsoft/TypeScript/issues/61037
 */
const transformer = {
  afterDeclarations: [(context) => {
    return (sourceFile) => {
      const visitor = (node) => {
        if (
          ts.isExportDeclaration(node) &&
          node.moduleSpecifier &&
          ts.isStringLiteral(node.moduleSpecifier)
        ) {
          const text = node.moduleSpecifier.text;

          if (text.endsWith(".tsx") || text.endsWith(".ts")) {
            return ts.factory.updateExportDeclaration(
              node,
              node.modifiers,
              node.isTypeOnly,
              node.exportClause,
              ts.factory.createStringLiteral(
                text.replace(/\.(ts|tsx)$/, ".d.ts"),
              ),
              node.attributes,
            );
          }
        }
        return ts.visitEachChild(node, visitor, context);
      };

      return ts.visitNode(sourceFile, visitor);
    };
  }],
};
