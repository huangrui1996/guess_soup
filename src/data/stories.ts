export type TDifficulty = 'easy' | 'medium' | 'hard'

export type TStoryType = '都市怪谈' | '日常悖论' | '科幻脑洞' | '轻松搞笑'

export type TStory = {
  id: string
  title: string
  difficulty: TDifficulty
  type: TStoryType
  surface: string
  bottom: string
}

// MVP 示例数据（后续可替换为真实人工题库/AI 题库）。
// 注意：PRD 要求故事包含 id/title/difficulty/surface/bottom，这里同时保留了 type 字段用于分类展示。
export const stories: TStory[] = [
  {
    id: 'd-001',
    title: '楼道里多出来的脚步声',
    difficulty: 'easy',
    type: '都市怪谈',
    surface:
      '晚上你回家，电梯门一开，楼道里传来两声脚步：你自己的，还有另一双“紧跟”的。奇怪的是，你从未在楼道里遇到任何人。',
    bottom:
      '所谓“紧跟”的脚步来自楼道声控灯录音触发的回放延迟；你进门后灯的麦克风把上一段语音当成了脚步声播放，制造了“有人跟着你”的错觉。',
  },
  {
    id: 'd-002',
    title: '咖啡杯从不变凉',
    difficulty: 'medium',
    type: '日常悖论',
    surface:
      '你明明把咖啡放在桌上离开了二十分钟，回来时杯子还是温热的，甚至表面蒸汽仍在。你确定自己没有使用任何保温功能。',
    bottom:
      '桌面下的“微型加热垫”被同一插排自动定时开启；你离开的时间刚好落在加热窗口里，所以杯子看起来“不变凉”，但并非超自然。',
  },
  {
    id: 'd-003',
    title: '会议室里缺席的投影',
    difficulty: 'hard',
    type: '科幻脑洞',
    surface:
      '你在会议上展示数据，突然发现投影仪画面里有一个“缺席者”的名字栏位：他从未被邀请，却每次都在同一位置出现。所有人都看见了他。',
    bottom:
      '投影系统在同一模板位置缓存了上一轮培训的参会名单；由于投影与会议电脑的时序同步延迟，模板在真正渲染后又被“回放叠加”一次，于是缺席者的名字被错误地显示出来。',
  },
  {
    id: 'd-004',
    title: '便利店的退货奇迹',
    difficulty: 'easy',
    type: '轻松搞笑',
    surface:
      '你在便利店退货，只拿走了收据，没有带走任何商品。可第二天收银台却对你“关心”了一次：说退货的东西已经被你吃掉了？',
    bottom:
      '收据打印机被设置成会根据当天“未完成退款状态”自动补一句提示；系统把你上一单的“点外卖未取”误归到退货流程里，于是店员看见提示以为你已经拿走并吃了。',
  },
  {
    id: 'd-005',
    title: '门铃响在你出门之后',
    difficulty: 'medium',
    type: '都市怪谈',
    surface:
      '你准备出门时听到门铃响了。你打开门看，走廊空无一人。可就在你锁门转身的那一刻，门铃又响了一次——仿佛在确认你“终于出去”。',
    bottom:
      '门铃采用的是“延迟推送”通讯：第一次响是对讲机离线缓存重连；第二次响触发于你锁门后门禁系统上报成功，系统把状态变化也当成了“呼叫事件”，重复通知导致两次铃声。',
  },
]

// 兼容旧代码（如果你后续把导出名统一到 stories，这里也可以删掉）。
export const STORIES: TStory[] = stories

