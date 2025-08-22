import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { LANGUAGE_LIST } from './constants';

/**
 * LangConfig 转换完成的语言配置，用于输出成独立的语言配置 JSON 文件
 */
interface LangConfig {
  [key: string]: string | LangConfig;
}

/**
 * MixedLangConfig 开发过程中将多个语言混合在一起的配置，通常对开发很友好，但不能用于输出成独立的语言配置 JSON 文件
 */
interface MixedLangConfig {
  [key: string]: string | string[] | MixedLangConfig;
}

/**
 * 刷新 JSON 对象
 *
 * @param {string} folderPath - 文件夹绝对路径
 */
const getDirectoryInfo = (folderPath: string) => {
  /**
   * 当前文件夹下的所有直属子文件夹数组
   */
  const directories: [string, string][] = [];
  /**
   * 当前文件夹下的所有直属文件数组
   */
  const filePaths: [string, string][] = [];

  fs.readdirSync(folderPath).forEach((item) => {
    const itemPath = path.join(folderPath, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      directories.push([itemPath, item]);
    } else if (path.extname(item) === '.json') {
      filePaths.push([itemPath, item]);
    }
  });

  return { directories, filePaths };
};

/**
 * 刷新 JSON 对象
 *
 * @param {string} folderPath - 文件夹绝对路径
 * @param {MixedLangConfig} parentResult - 父级的 JSON 对象
 */
function refreshJSON(folderPath: string, parentResult: MixedLangConfig) {
  const { directories, filePaths } = getDirectoryInfo(folderPath);

  filePaths.forEach(([fullFilePath, currentFilePath]) => {
    if (path.extname(currentFilePath) !== '.json') return;

    const key = currentFilePath.slice(0, currentFilePath.length - 5);
    const fileContent = JSON.parse(fs.readFileSync(fullFilePath, 'utf-8')) as MixedLangConfig;

    parentResult[key] = fileContent;
  });

  directories.forEach(([fullDirectory, currentDirectory]) => {
    let currentResult = parentResult[currentDirectory] as MixedLangConfig | undefined;
    if (typeof currentResult === 'string') {
      throw new Error(`parent directory value is string: ${fullDirectory} - ${currentDirectory}`);
    } else if (Array.isArray(currentResult)) {
      throw new Error(`parent directory value is array: ${fullDirectory} - ${currentDirectory}`);
    } else {
      if (!currentResult) {
        currentResult = {};
        parentResult[currentDirectory] = currentResult;
      }

      refreshJSON(fullDirectory, currentResult);
    }
  });
}

/**
 * 刷新 JSON 对象
 *
 * @param {LangConfig} singleLanguageConfig - 单语言配置
 * @param {MixedLangConfig} partialMixedConfig - 一部分混合的语言配置
 * @param {number} index - 当前语言的配置在混合语言配置中占据的索引
 */
const refreshConfig = (singleLanguageConfig: LangConfig, partialMixedConfig: MixedLangConfig, index: number) => {
  Object.keys(partialMixedConfig).forEach((key) => {
    if (singleLanguageConfig[key]) {
      throw new Error(`has the same key: ${key}`);
    }

    const currentConfig = partialMixedConfig[key] as string | string[] | MixedLangConfig | undefined;
    if (typeof currentConfig === 'string') {
      singleLanguageConfig[key] = currentConfig;
    } else if (Array.isArray(currentConfig)) {
      const currentConfigValue = currentConfig[index] as string | undefined | null;
      if (currentConfigValue !== null && currentConfigValue !== undefined) {
        singleLanguageConfig[key] = currentConfigValue;
      }
    } else if (!!currentConfig && currentConfig instanceof Object) {
      const currentConfigValue: LangConfig = {};
      singleLanguageConfig[key] = currentConfigValue;

      refreshConfig(currentConfigValue, currentConfig, index);
    }
  });
};

export const languageFilesIntegrationPlugin = {
  name: 'language-files-integration',
  apply: 'serve',
  buildStart() {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const rootPath = path.resolve(__dirname, 'locales');

    /**
     * @type MixedLangConfig
     *
     * - 初始定义时不包含任何内容
     * - 经过了 `refreshJSON` 方法处理后，就形成了 `MixedLangConfig` 类型的对象
     */
    const result: MixedLangConfig = {};
    refreshJSON(rootPath, result);

    /**
     * 转换所有的 `MixedLangConfig` 类型的配置
     */
    const allOfLanguage = LANGUAGE_LIST.reduce<LangConfig>((acc, lang, i) => {
      let language = acc[lang] as string | LangConfig | null | undefined;
      if (typeof language === 'string') {
        throw new Error(`data structure is error: ${lang}`);
      } else if (language === null || language === undefined) {
        language = {} as LangConfig;
        acc[lang] = language;
      }
      refreshConfig(language, result, i);

      return acc;
    }, {});

    /**
     * 检查输出文件夹是否存在，存在则删除后新建一个空的输出文件夹
     */
    const outputDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    /**
     * 将 `LANGUAGE_LIST` 中指定输出的语言配置，写入到输出文件夹的独立文件中
     */
    LANGUAGE_LIST.forEach((lang) => {
      fs.writeFileSync(path.resolve(outputDir, `${lang}.json`), JSON.stringify(allOfLanguage[lang], null, 2), 'utf-8');
    });
  },
};