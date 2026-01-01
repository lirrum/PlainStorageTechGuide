"""
Lirrum's Custom Markdown Syntax Extension for PSTG.
Provides:
    =text=  for spoiler blur
    [text]<style> for inline styling
"""
import markdown
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
import xml.etree.ElementTree as etree
import re

class LirrumStylePattern(InlineProcessor):
    """处理 [text]<style> 语法，例如 [重要]<red>"""
    def handleMatch(self, m, data):
        el = etree.Element('span')
        el.set('class', f'lirrum-{m.group(2).strip()}')
        el.text = m.group(1)
        return el, m.start(0), m.end(0)

class LirrumSpoilerPattern(InlineProcessor):
    """处理 =text= 马赛克语法，例如 =答案="""
    def handleMatch(self, m, data):
        el = etree.Element('span')
        el.set('class', 'lirrum-spoiler')
        el.set('data-tooltip', '点击或悬停显示')
        el.text = m.group(1)
        return el, m.start(0), m.end(0)

class LirrumSyntaxExtension(Extension):
    """主扩展类"""
    def extendMarkdown(self, md):
        md.inlinePatterns.register(
            LirrumStylePattern(r'\[([^\]]+)\]<([^>]+)>'), 
            'lirrum_style', 
            175
        )
        md.inlinePatterns.register(
            LirrumSpoilerPattern(r'=(\S(?:[^=]*\S)?)='), 
            'lirrum_spoiler', 
            176
        )

def makeExtension(**kwargs):
    """Markdown标准入口函数"""
    return LirrumSyntaxExtension(**kwargs)