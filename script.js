new Vue({
    el: '#notebook',
    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],    //所有笔记
            selectedId: localStorage.getItem('selected-id') || null    //当前选中笔记的id
        }
    },
    computed: {
        //获得当前选中笔记的文本
        notePreview() {
            return this.selectedNote ? marked(this.selectedNote.content) : ''
        },
        //添加笔记按钮的额外信息
        addButtonTitle() {
            return this.notes.length + ' note(s) already'
        },
        //通过selectedId获得当前选中的note
        selectedNote() {
            return this.notes.find((note) => {return note.id === this.selectedId})
        },
        //收藏的笔记排在最前面，且按时间排序
        sortedNotes() {
            return this.notes.slice()
                .sort((a, b) => {  //升序  1   2
                     return a.created - b.created
                })
                .sort((a, b) => {
                    return (a.favorite === b.favorite) ? 0 : (a.favorite ? -1 : 1)
                })
        },
        linesCount() {
            if (this.selectedNote) {
                // 计算换行符的个数
                return this.selectedNote.content.split(/\r\n|\r|\n/).length
            }
        },

        wordsCount() {
            if (this.selectedNote) {
                var s = this.selectedNote.content
                // 将换行符转换为空格
                s = s.replace(/\n/g, ' ')
                // 排除开头和结尾的空格
                s = s.replace(/(^\s*)|(\s*$)/gi, '')
                // 将多个重复空格转换为一个
                s = s.replace(/\s\s+/gi, ' ')
                // 返回空格数量
                return s.split(' ').length
            }
        },

        charactersCount() {
            if (this.selectedNote) {
                return this.selectedNote.content.split('').length
            }
        }
    },
    watch: {
        notes: {
            handler: 'saveNotes',
            deep: true
        },
        selectedId: 'saveSelectedId'
    },
    methods: {
        //添加笔记
        addNote() {
            const time = Date.now()
            const note = {
                id: String(time),
                title: 'new Note' + (this.notes.length + 1),
                content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet\n' +
                    ') for formatting!',
                created: time,
                favorite: false
            }
            this.notes.push(note)
        },
        //更新selectedId
        selectNote(note) {
            this.selectedId = note.id
        },
        //将所有笔记保存到本地
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes))
        },
        //将当前选中的笔记id保存到本地
        saveSelectedId(val) {
            localStorage.setItem('selected-id', val)
        },
        //删除笔记
        removeNote() {
            if(this.selectedId && confirm('Delete this note?')) {
                const index = this.notes.indexOf(this.selectedNote)
                if(index !== -1) {
                    this.notes.splice(index, 1)
                }
            }

        },
        //收藏笔记
        favoriteNote() {
            this.selectedNote.favorite = !this.selectedNote.favorite
        }
    },
    filters: {
        date(time) {
            return moment(time).format('DD/MM/YY, HH:mm')
        }
    }
})




