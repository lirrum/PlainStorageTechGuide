"""
PSTG's Custom Markdown Syntax Extension for PSTG.
Provides:
    =text=  for spoiler blur
    [text]<style> for inline styling
    ![alt](url){attribute} for image sizing
"""
import markdown
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
import xml.etree.ElementTree as etree
import re
import shlex

class PSTGStylePattern(InlineProcessor):
    def handleMatch(self, m, data):
        style = m.group(2).strip()
        el = etree.Element('span')
        el.set('class', f'PSTG-{style}')
        el.text = m.group(1)
        return el, m.start(0), m.end(0)

class PSTGSpoilerPattern(InlineProcessor):
    def handleMatch(self, m, data):
        el = etree.Element('span')
        el.set('class', 'PSTG-spoiler')
        el.set('data-tooltip', '点击或悬停显示')
        el.text = m.group(1)
        return el, m.start(0), m.end(0)

class PSTGImagePattern(InlineProcessor):
    def handleMatch(self, m, data):
        alt_text = m.group(1)
        img_url = m.group(2)
        title = m.group(3)
        attr_string = m.group(4)
        
        img_el = etree.Element('img')
        img_el.set('src', img_url)
        img_el.set('alt', alt_text if alt_text else '')
        img_el.set('class', 'PSTG-img')
        
        if alt_text:
            img_el.set('data-title', alt_text)
        if title:
            img_el.set('title', title)
        
        if attr_string:
            attrs = self.parse_attributes(attr_string)
            for key, value in attrs.items():
                if key in ['width', 'height', 'style', 'class', 'id']:
                    if key == 'class':
                        img_el.set('class', f'PSTG-img {value}')
                    else:
                        img_el.set(key, value)
        
        return img_el, m.start(0), m.end(0)
    
    def parse_attributes(self, attr_string):
        attrs = {}
        try:
            lexer = shlex.shlex(attr_string.strip('{}'), posix=True)
            lexer.whitespace = ' '
            lexer.wordchars += '=-.:/'
            tokens = list(lexer)
            for token in tokens:
                if '=' in token:
                    key, value = token.split('=', 1)
                    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                        value = value[1:-1]
                    attrs[key.strip()] = value.strip()
        except:
            for part in attr_string.strip('{}').split():
                if '=' in part:
                    key, value = part.split('=', 1)
                    if (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                        value = value[1:-1]
                    attrs[key.strip()] = value.strip()
        return attrs

class PSTGSyntaxExtension(Extension):
    def extendMarkdown(self, md):
        md.inlinePatterns.register(
            PSTGImagePattern(
                r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*(\{[^}]+\})?'
            ), 
            'PSTG_image', 
            170
        )
        md.inlinePatterns.register(
            PSTGStylePattern(r'\[([^\]]+)\]<([^>]+)>'), 
            'PSTG_style', 
            175
        )
        md.inlinePatterns.register(
            PSTGSpoilerPattern(r'=(\S(?:[^=]*\S)?)='), 
            'PSTG_spoiler', 
            176
        )

def makeExtension(**kwargs):
    return PSTGSyntaxExtension(**kwargs)