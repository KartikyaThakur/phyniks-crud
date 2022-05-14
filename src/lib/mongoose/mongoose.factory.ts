import { join, Path, strings } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import * as pluralize from 'pluralize';
import { DeclarationOptions, ModuleDeclarator, ModuleFinder } from '../..';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '../../utils/dependencies.utils';
import { normalizeToKebabOrSnakeCase } from '../../utils/formatting';
import { Location, NameParser } from '../../utils/name.parser';
import { mergeSourceRoot } from '../../utils/source-root.helpers';
import { MongooseOptions } from './mongoose.schema';

export function main(options: MongooseOptions): Rule {
  options = transform(options);

  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        addMappedTypesDependencyIfApplies(options),
        mergeSourceRoot(options),
        addDeclarationToModule(options),
        mergeWith(generate(options)),
      ]),
    )(tree, context);
  };
}

function transform(options: MongooseOptions): MongooseOptions {
  const target: MongooseOptions = Object.assign({}, options);
  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  target.metadata = 'imports';

  const location: Location = new NameParser().parse(target);
  target.name = normalizeToKebabOrSnakeCase(location.name);
  target.path = normalizeToKebabOrSnakeCase(location.path);
  target.language = target.language !== undefined ? target.language : 'ts';
  if (target.language === 'js') {
    throw new Error(
      'The "resource" schematic does not support JavaScript language (only TypeScript is supported).',
    );
  }

  target.path = target.flat
    ? target.path
    : join(target.path as Path, target.name);
  target.isSwaggerInstalled = options.isSwaggerInstalled ?? false;

  return target;
}

function generate(options: MongooseOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join('./files' as Path, options.language ?? '')), [
      options.schema ? noop() : filter((path) => !path.endsWith('.schema.ts')),
      template({
        ...strings,
        ...options,
        lowercased: (name: string) => {
          const classifiedName = classify(name);
          return (
            classifiedName.charAt(0).toLowerCase() + classifiedName.slice(1)
          );
        },
        singular: (name: string) => pluralize.singular(name),
        ent: (name: string) => name + '.entity',
      }),
      move(options.path?.toString() ?? ''),
    ])(context);
}

function addDeclarationToModule(options: MongooseOptions): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }
    options.module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    }) ?? undefined;
    if (!options.module) {
      return tree;
    }
    const content = tree.read(options.module)?.toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(
      options.module,
      declarator.declare(content ?? 'undefined', {
        ...options,
        // type: 'module',
      } as DeclarationOptions),
    );
    return tree;
  };
}

function addMappedTypesDependencyIfApplies(options: MongooseOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    try {
      const nodeDependencyRef = getPackageJsonDependency(
        host,
        '@nestjs/swagger',
      );
      if (nodeDependencyRef) {
        options.isSwaggerInstalled = true;
        return;
      }
      if (!nodeDependencyRef) {
        addPackageJsonDependency(host, {
          type: NodeDependencyType.Default,
          name: '@nestjs/mapped-types',
          version: '*',
        });
        context.addTask(new NodePackageInstallTask());
      }
    } catch (err) {
      // ignore if "package.json" not found
    }
  };
}
