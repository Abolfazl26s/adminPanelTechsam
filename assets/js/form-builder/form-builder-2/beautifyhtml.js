/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.


 Style HTML
---------------

  Written by Nochum Sossonko, (nsossonko@hotmail.com)

  Based on code initially developed by: Einar Lielmanis, <elfz@laacz.lv>
    http://jsbeautifier.org/

  Usage:
    style_html(html_source);

    style_html(html_source, options);

  The options are:
    indent_size (default 4)          — indentation size,
    indent_char (default space)      — character to indent with,
    max_char (default 250)            -  maximum amount of characters per line (0 = disable)
    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.
    unformatted (defaults to inline tags) - list of tags, that shouldn't be reformatted
    indent_scripts (default normal)  - "keep"|"separate"|"normal"

    e.g.

    style_html(html_source, {
      'indent_size': 2,
      'indent_char': ' ',
      'max_char': 78,
      'brace_style': 'expand',
      'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u']
    });
*/

(function() {

    function style_html(html_source, options, js_beautify, css_beautify) {
    //Wrapper function to invoke all the necessary constructors and deal with the output.

      var multi_parser,
          indent_size,
          indent_character,
          max_char,
          brace_style,
          unformatted;

      options = options || {};
      indent_size = options.indent_size || 4;
      indent_character = options.indent_char || ' ';
      brace_style = options.brace_style || 'collapse';
      max_char = options.max_char === 0 ? Infinity : options.max_char || 250;
      unformatted = options.unformatted || ['a', 'span', 'bdo', 'em', 'strong', 'dfn', 'code', 'samp', 'kbd', 'var', 'cite', 'abbr', 'acronym', 'q', 'sub', 'sup', 'tt', 'i', 'b', 'big', 'small', 'u', 's', 'strike', 'font', 'ins', 'del', 'pre', 'address', 'dt', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      function Parser() {

        this.pos = 0; //Parser position
        this.token = '';
        this.current_mode = 'CONTENT'; //reflects the current Parser mode: TAG/CONTENT
        this.tags = { //An object to hold tags, their position, and their parent-tags, initiated with default values
          parent: 'parent1',
          parentcount: 1,
          parent1: ''
        };
        this.tag_type = '';
        this.token_text = this.last_token = this.last_text = this.token_type = '';

        this.Utils = { //Uilities made available to the various functions
          whitespace: "\n\r\t ".split(''),
          single_token: 'br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed,?php,?,?='.split(','), //all the single tags for HTML
          extra_liners: 'head,body,/html'.split(','), //for tags that need a line of whitespace before them
          in_array: function (what, arr) {
            for (var i=0; i<arr.length; i++) {
              if (what === arr[i]) {
                return true;
              }
            }
            return false;
          }
        };

        this.get_content = function () { //function to capture regular content between tags

          var input_char = '',
              content = [],
              space = false; //if a space is needed

          while (this.input.charAt(this.pos) !== '<') {
            if (this.pos >= this.input.length) {
              return content.length?content.join(''):['', 'TK_EOF'];
            }

            input_char = this.input.charAt(this.pos);
            this.pos++;
            this.line_char_count++;

            if (this.Utils.in_array(input_char, this.Utils.whitespace)) {
              if (content.length) {
                space = true;
              }
              this.line_char_count--;
              continue; //don't want to insert unnecessary space
            }
            else if (space) {
              if (this.line_char_count >= this.max_char) { //insert a line when the max_char is reached
                content.push('\n');
                for (var i=0; i<this.indent_level; i++) {
                  content.push(this.indent_string);
                }
                this.line_char_count = 0;
              }
              else{
                content.push(' ');
                this.line_char_count++;
              }
              space = false;
            }
            content.push(input_char); //letter at-a-time (or string) inserted to an array
          }
          return content.length?content.join(''):'';
        };

        this.get_contents_to = function (name) { //get the full content of a script or style to pass to js_beautify
          if (this.pos === this.input.length) {
            return ['', 'TK_EOF'];
          }
          var input_char = '';
          var content = '';
          var reg_match = new RegExp('</' + name + '\\s*>', 'igm');
          reg_match.lastIndex = this.pos;
          var reg_array = reg_match.exec(this.input);
          var end_script = reg_array?reg_array.index:this.input.length; //absolute end of script
          if(this.pos < end_script) { //get everything in between the script tags
            content = this.input.substring(this.pos, end_script);
            this.pos = end_script;
          }
          return content;
        };

        this.record_tag = function (tag){ //function to record a tag and its parent in this.tags Object
          if (this.tags[tag + 'count']) { //check for the existence of this tag type
            this.tags[tag + 'count']++;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
          }
          else { //otherwise initialize this tag type
            this.tags[tag + 'count'] = 1;
            this.tags[tag + this.tags[tag + 'count']] = this.indent_level; //and record the present indent level
          }
          this.tags[tag + this.tags[tag + 'count'] + 'parent'] = this.tags.parent; //set the parent (i.e. in the case of a div this.tags.div1parent)
          this.tags.parent = tag + this.tags[tag + 'count']; //and make this the current parent (i.e. in the case of a div 'div1')
        };

        this.retrieve_tag = function (tag) { //function to retrieve the opening tag to the corresponding closer
          if (this.tags[tag + 'count']) { //if the openener is not in the Object we ignore it
            var temp_parent = this.tags.parent; //check to see if it's a closable tag.
            while (temp_parent) { //till we reach '' (the initial value);
              if (tag + this.tags[tag + 'count'] === temp_parent) { //if this is it use it
                break;
              }
              temp_parent = this.tags[temp_parent + 'parent']; //otherwise keep on climbing up the DOM Tree
            }
            if (temp_parent) { //if we caught something
              this.indent_level = this.tags[tag + this.tags[tag + 'count']]; //set the indent_level accordingly
              this.tags.parent = this.tags[temp_parent + 'parent']; //and set the current parent
            }
            delete this.tags[tag + this.tags[tag + 'count'] + 'parent']; //delete the closed tags parent reference...
            delete this.tags[tag + this.tags[tag + 'count']]; //...and the tag itself
            if (this.tags[tag + 'count'] === 1) {
              delete this.tags[tag + 'count'];
            }
            else {
              this.tags[tag + 'count']--;
            }
          }
        };

        this.get_tag = function (peek) { //function to get a full tag and parse its type
          var input_char = '',
              content = [],
              comment = '',
              space = false,
              tag_start, tag_end,
              orig_pos = this.pos,
              orig_line_char_count = this.line_char_count;

          peek = peek !== undefined ? peek : false;

          do {
            if (this.pos >= this.input.length) {
              if (peek) {
                this.pos = orig_pos;
                this.line_char_count = orig_line_char_count;
              }
              return content.length?content.join(''):['', 'TK_EOF'];
            }

            input_char = this.input.charAt(this.pos);
            this.pos++;
            this.line_char_count++;

            if (this.Utils.in_array(input_char, this.Utils.whitespace)) { //don't want to insert unnecessary space
              space = true;
              this.line_char_count--;
              continue;
            }

            if (input_char === "'" || input_char === '"') {
              if (!content[1] || content[1] !== '!') { //if we're in a comment strings don't get treated specially
                input_char += this.get_unformatted(input_char);
                space = true;
              }
            }

            if (input_char === '=') { //no space before =
              space = false;
            }

            if (content.length && content[content.length-1] !== '=' && input_char !== '>' && space) {
                //no space after = or before >
              if (this.line_char_count >= this.max_char) {
                this.print_newline(false, content);
                this.line_char_count = 0;
              }
              else {
                content.push(' ');
                this.line_char_count++;
              }
              space = false;
            }
            if (input_char === '<') {
              tag_start = this.pos - 1;
            }
            content.push(input_char); //inserts character at-a-time (or string)
          } while (input_char !== '>');

          var tag_complete = content.join('');
          var tag_index;
          if (tag_complete.indexOf(' ') !== -1) { //if there's whitespace, thats where the tag name ends
            tag_index = tag_complete.indexOf(' ');
          }
          else { //otherwise go with the tag ending
            tag_index = tag_complete.indexOf('>');
          }
          var tag_check = tag_complete.substring(1, tag_index).toLowerCase();
          if (tag_complete.charAt(tag_complete.length-2) === '/' ||
            this.Utils.in_array(tag_check, this.Utils.single_token)) { //if this tag name is a single tag type (either in the list or has a closing /)
            if ( ! peek) {
              this.tag_type = 'SINGLE';
            }
          }
          else if (tag_check === 'script') { //for later script handling
            if ( ! peek) {
              this.record_tag(tag_check);
              this.tag_type = 'SCRIPT';
            }
          }
          else if (tag_check === 'style') { //for future style handling (for now it justs uses get_content)
            if ( ! peek) {
              this.record_tag(tag_check);
              this.tag_type = 'STYLE';
            }
          }
          else if (this.is_unformatted(tag_check, unformatted)) { // do not reformat the "unformatted" tags
            comment = this.get_unformatted('</'