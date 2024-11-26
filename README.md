# 欢迎来到Minecraft 数据包 非官方文档
这里是基本介绍，左侧是目录，右侧是内容
本页面引用了Minecraft Wiki 数据
[Wiki链接](https://zh.minecraft.wiki/w/数据包)。

## 数据包就是由Minecraft命令组成的
```mcfunction
tp @a 0 0 0 
```
# 数据包的基本文件结构

数据包根目录
---
* `<_数据包名称_>`：数据包根目录
    * `pack.mcmeta`：数据包元数据。这是数据包根目录下唯一**必要**的文件。
    * `pack.png`：选择数据包界面中的图标。
    * `data`：数据目录
        * `<_命名空间_>`：命名空间文件夹，可以包含多个不同的命名空间
            * `function`：存放函数文件
                * `<_函数名称_>.mcfunction`
            * `structure`：存放结构模板文件
                * `<_结构名称_>.nbt`
            * `tags`：包含多个子文件夹，用于标签定义
                * `<_注册名_>`：存放标签文件
                    * `<_标签名称_>.json`
            * `advancement`：存放进度文件
                * `<_进度名称_>.json`
            * `banner_pattern`：存放旗帜图案文件
                * `<_旗帜图案名称_>.json`
            * `chat_type`：存放聊天类型文件
                * `<_聊天类型名称_>.json`
            * `damage_type`：存放伤害类型文件
                * `<_伤害类型名称_>.json`
            * `datapacks`：存放内置数据包
                * `<内置数据包名称>`
            * `dimension`：存放维度文件
                * `<_维度名称_>.json`
            * `dimension_type`：存放维度类型文件
                * `<_维度类型名称_>.json`
            * `enchantment`：存放魔咒文件
                * `<_魔咒名称_>.json`
            * `enchantment_provider`：存放魔咒提供器文件
                * `<魔咒提供器名称>.json`
                * `raid`：存放用于袭击的魔咒提供器文件
                    * `<用于袭击的魔咒提供器名称>.json`
            * `instrument`：存放山羊角乐器文件
                * `<_山羊角乐器名称_>.json`
            * `item_modifier`：存放物品修饰器文件
                * `<_物品修饰器名称_>.json`
            * `jukebox_song`：存放唱片机曲目文件
                * `<_唱片音乐名称_>.json`
            * `loot_table`：存放战利品表文件
                * `<_战利品表名称_>.json`
            * `painting_variant`：存放画变种文件
                * `<_画变种名称_>.json`
            * `predicate`：存放战利品表谓词文件
                * `<_战利品表谓词名称_>.json`
            * `recipe`：存放配方文件
                * `<_配方名称_>.json`
            * `trial_spawner`：存放试炼刷怪笼设置数据文件
                * `<_试炼刷怪笼设置数据名称_>.json`
            * `trim_material`：存放盔甲纹饰材料文件
                * `<_盔甲纹饰材料名称_>.json`
            * `trim_pattern`：存放盔甲纹饰图案文件
                * `<_盔甲纹饰图案名称_>.json`
            * `wolf_variant`：存放狼变种文件
                * `<_狼变种名称_>.json`
            * `worldgen`：存放世界生成相关文件
                * `biome`：存放生物群系文件
                    * `<_生物群系名称_>.json`
                * `configured_carver`：存放雕刻器文件
                    * `<_雕刻器名称_>.json`
                * `configured_feature`：存放地物文件
                    * `<_地物名称_>.json`
                * `placed_feature`：存放已放置地物文件
                    * `<_已放置地物名称_>.json`
                * `noise_settings`：存放噪声设置文件
                    * `<_噪声设置名称_>.json`
                * `noise`：存放噪声文件
                    * `<_噪声名称_>.json`
                * `density_function`：存放密度函数文件
                    * `<_密度函数名称_>.json`
                * `multi_noise_biome_source_parameter_list`：存放多噪声生物群系源参数表文件
                    * `<_多噪声生物群系源参数表名称_>.json`
                * `processor_list`：存放方块处理器文件
                    * `<_方块处理器名称_>.json`
                * `structure`：存放结构文件
                    * `<_结构名称_>.json`
                * `structure_set`：存放结构集文件
                    * `<_结构集名称_>.json`
                * `template_pool`：存放结构池文件
                    * `<_结构池名称_>.json`
                * `flat_level_generator_preset`：存放超平坦预设文件
                    * `<_超平坦预设名称_>.json`
                * `world_preset`：存放世界预设文件
                    * `<_世界预设名称_>.json`
pack.mcmeta
---
- **根对象 (compound)**
  - **pack (compound)**: 存放数据包信息。
    - **description (string/list/compound)**: 数据包的描述信息。
      - 如果是字符串 (string)，则是简单的描述文本。
      - 如果是列表 (list)，则可以包含多个文本组件。
      - 如果是复合对象 (compound)，则可能包含更复杂的文本组件结构。
    - **pack_format (int)**: 数据包支持的版本编号。
    - **supported_formats (int/int-array/compound)**: （可选）数据包支持的版本编号范围。
      - **int**: 支持单个版本。
      - **int-array**: 支持的版本范围。
      - **compound**: 版本范围。
        - **min_inclusive (int)**: 最低兼容版本。
        - **max_inclusive (int)**: 最高支持版本。
  - **filter (compound)**: （可选）包过滤器，用于指定数据包要忽略的文件。
    - **block (list of compound)**: 模式列表。
      - **namespace (string)**: 要滤除文件的命名空间的正则表达式。
      - **path (string)**: 要滤除文件的路径的正则表达式。
  - **features (compound)**: （可选）实验性内容启用。
    - **enabled (list of string)**: 启用的内容列表。
  - **overlays (compound)**: （可选）指定要覆盖的部分。
    - **entries (list of compound)**: 覆盖列表。
      - **formats (int/int-array/compound)**: 版本编号范围。
      - **directory (string)**: 要覆盖的目录名。

一个最简单的pack.mcmeta文件
```json
{
  "pack": {
    "pack_format": 41,
    "description": "我是一个数据包"
  }
}
```
41是1.20.6版本的数据包
