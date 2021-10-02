import GlobalThemeProvider from '../../../style/GlobalThemeProvider'
import QuestionList, { Props } from './index'

export default {
  title: 'Organisms/QuestionList',
  component: QuestionList,
}

export const Default = (props: Props) => {
  const data = [
    {
      title: '글 제목 글 제목1',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: true,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목2',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목3',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목4',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목5',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목6',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목7',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
    {
      title: '글 제목 글 제목8',
      desc:
        '글 미리보기 미리보기 미리보기 글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기글 미리보기 미리보기 미리보기',
      check: false,
      answer_cnt: 1,
      like_cnt: 2,
      view_cnt: 4,
      tag: ['TAG1', 'TAG2'],
      create_time: '2021-10-01T00:10:20.000Z',
    },
  ]

  return (
    <GlobalThemeProvider>
      <QuestionList data={data} {...props} />
    </GlobalThemeProvider>
  )
}