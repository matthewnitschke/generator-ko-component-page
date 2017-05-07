'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('ko-component-page') + ' generator!'
    ));

    var prompts = [
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do',
      choices: [
       'init',
       'add parameter',
       'add example'
     ]
    }];

    var initPrompts = [{
      type: 'input',
      name: 'componentName',
      message: 'What is the componts name: '
    }];

    var parameterPrompts = [{
      type: 'input',
      name: 'parameterName',
      message: 'enter parameter name:'
    },
    {
      type: 'input',
      name: 'parameterType',
      message: 'enter paramter type:'
    },
    {
      type: 'input',
      name: 'parameterDescription',
      message: 'enter parameter description:'
    },
    {
      type: 'confirm',
      name: 'requiredParameter',
      message: 'is this parameter required'
    }];

    this.prompt(prompts, function (props) {
      var self = this;
      self.props = props;

      if (this.props.action == "init"){
        this.prompt(initPrompts, function(optionsProps){
          self.options = optionsProps;
          done();
        });
      } else if(this.props.action == "add parameter"){
        this.prompt(parameterPrompts, function(optionsProps){
          self.options = optionsProps;
          done();
        });
      } else if (this.props.action == "add example"){
        done();
      }

    }.bind(this));
  },

  writing: function () {
    var beautify = require('gulp-html-beautify');
    this.registerTransformStream(beautify({indent_size: 2 }));

    var options = this.options;

    if (this.props.action == "init"){
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('index.html'),
        { componentName: options.componentName }
      );
    } else if (this.props.action == "add parameter"){


      var templatePath = this.destinationPath("index.html");
      this.fs.copy(templatePath, templatePath, {
        process: function (currentFile) {
          currentFile = currentFile.toString(); // convert the Buffer to a string

          var required = options.requiredParameter ? 'required ' : '';
          var content = `<ko-component-parameter ${required}params="{name: '${options.parameterName}', type: '${options.parameterType}', description: '${options.parameterDescription}'}"></ko-component-parameter>`;
          var idx = currentFile.lastIndexOf("</ko-component-parameters>");

          var finalFile = currentFile.substring(0, idx) + content + currentFile.substring(idx, currentFile.length);

          return finalFile;
        }
      });
    } else if (this.props.action == "add example"){
      var templatePath = this.destinationPath("index.html");
      this.fs.copy(templatePath, templatePath, {
        process: function (currentFile) {
          currentFile = currentFile.toString(); // convert the Buffer to a string

          var content =`
          <ko-component-example params="{label: '', description: ''}">
           <ko-component-example-script>
               {
               }
           </ko-component-example-script>
          </ko-component-example>\n
          `;

           var idx = currentFile.lastIndexOf("</ko-component-examples>");

           var finalFile = currentFile.substring(0, idx) + content + currentFile.substring(idx, currentFile.length);
           return finalFile;
        }
      });
    }
  },

  install: function () {
    this.installDependencies();
  }
});
