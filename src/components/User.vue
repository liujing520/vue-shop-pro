<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editUserDialog" width="50%" @close="resetEditForm()">
      <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="resetForm()">
      <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tianjia()">确 定</el-button>
      </span>
    </el-dialog>
    <!--卡片区-->
    <el-card class="box-card">
      <!--搜索框 和 添加按钮-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            v-model="querycdt.query"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格展示数据-->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="140"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <!-- 在该处要显示多条记录的不同状态，有的是激活的，有的是未激活的
            我们需要在此处把每条用户的记录信息都获取到，然后获取每个用户的状态信息
            现在我们难在看不到v-for遍历的机制代码
            具体语法为：
            <标签 slot-scope="xxx"></标签>
            xxx就是带表当前el-table遍历出来的每个用户的信息，但是需要xxx.row的方式来获取
          是作用域插槽的用法-->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <!-- 我们需要获取到被删除信息用户的id值，需要获取到当前的每条记录信息，并从中获取id的字段信息 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    // 修改用户相关1
    xiugai() {
      // 表单验证
      this.$refs.editUserRef.validate(async valid => {
        if (valid) {
          // 校验成功处理， 收集数据存储入库
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          // 修改失败提示
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 修改成功：关闭对话框、成功提示、页面数据更新
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    // 关闭Dialog,重置form表单
    resetEditForm() {
      this.$refs.editUserRef.resetFields()
    },

    // 显示修改用户的对话框
    // param id: 被修改用户的id
    async showEditDialog(id) {
      // 根据id获得被修改用户的信息
      const { data: dt } = await this.$http.get('users/' + id)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获得到的用户信息 赋予 给editForm表单数据对象
      this.editUser = dt.data
      // 显示对话框
      this.editUserDialog = true
    },
    // 修改用户相关2

    // 删除用户
    // param id: 被删除用户的id
    delUser(id) {
      // 确认
      this.$confirm('确定要删除该用户么?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // 服务端实现删除数据逻辑，具体通过axios实现
          const { data: res } = await this.$http.delete('users/' + id)
          // console.log(dt)
          // 删除判断和逻辑
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功：消息提示、刷新数据
          this.$message.success(res.meta.msg)
          // 如果当前页只有一条数据，那么请给页码做减一操作（前提是当前页码大于一页）
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          // 刷新数据
          this.getUserList()
        })
        .catch(() => {})
    },
    // 添加用户对话框和form表单相关1
    tianjia() {
      // 校验form表单
      // async：需要设置到异步调用在这的最近的包围函数
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          // 获取各个表单域信息
          // 利用axios把表单域的信息传递到后端储存
          const { data: dt } = await this.$http.post('/users', this.addUser)
          // console.log(dt)
          // 添加失败处理
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 添加数据成功
          // 关闭dialog，成功提示，刷新数据
          this.addUserDialog = false
          this.$message.success(dt.meta.msg)
          this.getUserList()
        }
      })
    },
    resetForm() {
      // 具备校验条件的表单域才给重置
      this.$refs.addUserRef.resetFields()
    },
    // 添加用户对话框和form表单相关2
    //   数据检索
    search() {
      this.getUserList()
    },
    /**  数据分页相关1 */
    // 每条记录条数变化的回调处理
    handleSizeChange(val) {
      // arg: 变化后的记录条数
      // console.log(arg)
      this.querycdt.pagesize = val
      // 重新根据条件获得数据
      this.getUserList()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(val) {
      // val: 变化后的当前页码值
      // console.log(val)
      this.querycdt.pagenum = val
      // 根据变化后的页码重新获得数据
      this.getUserList()
    },
    /** 数据分页相关2 */

    // 获取用户列表数据
    async getUserList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.querycdt
      })
      console.log(dt)
      // 获取失败数据处理
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 把获取到的数据总条数赋予给tot储存
      this.tot = dt.data.total
      // 把获取到的数据传递给userList成员
      this.userList = dt.data.users
    }
  },
  data() {
    // 为校验手机号码生成一个函数
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功，继续执行
      callback()
    }
    return {
      // 修改用户相关1
      // 表单验证
      editUserRules: {
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 对话框显示标志
      editUserDialog: false,
      // form表单需要的数据对象
      editUser: {
        username: '',
        email: '',
        mobile: ''
      },
      // 修改用户相关2
      // 自定义表单校验规则
      // @param value:被校验的数据
      // @param callback:回调函数，校验无论成功还是失败都执行
      // 给表单域做校验
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 表单数据对象
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户相关1
      addUserDialog: false,
      // 添加用户相关2
      // 数据记录总条数
      tot: 0,
      // 获取用户数据列表需要的参数部分
      //   该参数在做数据检索和分页的时候都需要使用
      userList: [],
      // 查询数据条件
      querycdt: {
        query: '', // 查询关键字
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页查询数据条数
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
