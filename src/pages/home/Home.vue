<template>
  <div style="display: flex; justify-content: left;">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="searchForm.path" />
      </el-form-item>
      <!-- <el-form-item label="启用">
        <el-switch v-model="searchForm.enable" />
      </el-form-item> -->
    </el-form>
    <el-button size="large" type="primary" @click="getList">查询</el-button>
  </div>
  <div class="header">
    <el-pagination :current-page="pageSize.page" :page-size="pageSize.size" :page-sizes="[100, 200, 300, 400]" background
      layout="total, sizes, prev, pager, next, jumper" :total="pageSize.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <div>
      <el-button type="warning" @click="refresh">刷新服务</el-button>
      <el-button type="primary" @click="add">增加</el-button>
    </div>
  </div>
  <el-table :data="tableData" style="width: 100%;">
    <el-table-column prop="id" label="id" width="80" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="method" label="方法" width="80" />
    <el-table-column prop="path" label="路径" />
    <!-- <el-table-column prop="response" label="响应" min-width="240" ellipsis  /> -->
    <el-table-column prop="enabled" label="启用" width="80" />
    <el-table-column prop="remark" label="备注" width="380" ellipsis />
    <!-- <el-table-column prop="updatedTime" label="更新时间" /> -->
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <div class="btn">
          <el-button type="success" round size="small" @click="show(scope.row)">查看</el-button>
          <el-button type="primary" round size="small" @click="edit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除？" @confirm="del(scope.row)">
            <template #reference>
              <el-button type="danger" round size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="dialogFormVisible" title="接口定义">
    <el-form :model="form">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="方法">
        <el-select v-model="form.method" clearable placeholder="Select">
          <el-option v-for="item in methods" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="form.path" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="响应类型">
        <el-select v-model="form.resType" clearable placeholder="Select">
          <el-option v-for="item in resTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="响应" style="text-align: left;">
        <!-- <vue-jsoneditor v-if="form.resType === 'JSON'" height="400" :statusBar="true" :mainMenuBar="true" :navigationBar="false" mode="tree" v-model:json="form.response" /> -->
        <!-- <el-input v-else type="textarea" :rows="10" v-model="form.response" /> -->
        <el-input type="textarea" :rows="10" v-model="form.response" />
      </el-form-item>
      <!-- <el-form-item label="响应" style="text-align: left;"> -->
      <!-- <div>
          <textarea v-model="form.response" @input="validateJsCode"></textarea>
          <pre><code :class="'javascript'">{{ highlightedResp }}</code></pre>
        </div> -->
      <!-- <vue-jsoneditor height="400" mode="text" :queryLanguagesIds="JSON" v-model:json="form.response"/> -->
      <!-- <div style="height: 50%;"> -->
      <!-- <JsonEditorVue v-model="form.response" v-bind="{/* local props & attrs */ }" /> -->
      <!-- </div> -->
      <!-- <vue-json-editor v-model="form.response" :showBtns="false" :mode="'code'" /> -->
      <!-- <highlightjs language="" :code="form.response" /> -->
      <!-- </el-form-item> -->
      <el-form-item label="备注">
        <el-input type="textarea" :rows="3" v-model="form.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button v-if="form.id" type="primary" @click="modifyApi">
          修改
        </el-button>
        <el-button v-else type="primary" @click="createApi">
          增加
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-drawer v-model="showApi" title="接口详情" direction="rtl" size="40%">
    <template #default>
      <el-card class="box-card" v-if="curApi" style="text-align: left;">
        <template #header>
          <div class="card-header" style="display: flex;">
            <el-tag>
              <el-tag effect="dark" style="margin-right: 20px; padding-left: 10px;">{{ curApi.method }}</el-tag>
              <el-text class="mx-1" type="primary">{{ '/api' + curApi.path }}</el-text>
            </el-tag>
          </div>
        </template>
        <!-- <div v-if="curApi.resType === 'JSON'" v-text="JSON.stringify(JSON.parse(curApi.response), null, 4)"
          style="padding: 5px; border-radius: 4px; border: 1px solid #e1f3d8; background-color: #f0f9eb; color: #67C23A; text-align: left;white-space: break-spaces;">
        </div>
        <div v-else v-text="curApi.response"
          style="padding: 5px; border-radius: 4px; border: 1px solid #e1f3d8; background-color: #f0f9eb; color: #67C23A; text-align: left;white-space: break-spaces;">
        </div> -->
        <el-tag class="mx-1">{{ curApi.resType }}</el-tag>
        <!-- <div v-if="curApi.resType === 'JSON'"> -->
        <!-- <json-editor v-model="curApi.response" :options="{ mode: 'code', modes: ['code', 'tree'] }"></json-editor> -->
        <!-- <highlightjs language="Json" 
            v-h
          /><code></code> -->
        <!-- <pre v-highlightjs="curApi.response"><code></code></pre>
          <pre v-highlightjs="curApi.response"><code class="javascript"></code></pre> -->
        <!-- </div> -->
        <div v-if="curApi.resType === 'JSON'">
          <highlightjs language="json" :code="curApi.response" />
        </div>
        <div v-if="curApi.resType === 'JS'">
          <highlightjs language="javascript" :code="curApi.response" />
        </div>
        <!-- <el-tag type="success" style="width: 100%; min-height: 100px; text-align: left; white-space: break-spaces;">
          {{ JSON.stringify(JSON.parse(curApi.response), null, 4) }}
        </el-tag> -->
      </el-card>

    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { apiPage, getById, create, reload, modify, deleteApi } from '../../services/api'

const methods = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'DELETE', value: 'DELETE' },
  { label: 'PATCH', value: 'PATCH' },
]
const resTypes = [
  { label: 'JSON', value: 'JSON' },
  { label: 'JS', value: 'JS' },
]

const showApi = ref<boolean>(false)
const curApi = ref<Api>()
const dialogFormVisible = ref<boolean>(false)
const tableData = ref<Array<Api>>([])
const pageSize = reactive({
  page: 1,
  size: 10,
  total: 0
})
const emptyForm = {
  id: null,
  name: '',
  remark: '',
  path: '',
  method: '',
  resType: '',
  response: '',
  enabled: true
}
const form = reactive(emptyForm)
const searchForm = ref({name: '', path: '', enable: true})

onMounted(() => {
  getList()
})

const getList = () => {
  apiPage({ page: pageSize.page - 1, size: pageSize.size, params: searchForm.value }).then(res => {
    tableData.value = res.data.records
    pageSize.total = res.data.total
  })
}

const handleSizeChange = (val: number) => {
  pageSize.size = val
  getList()
}
const handleCurrentChange = (val: number) => {
  pageSize.page = val
  getList()
}

const add = () => {
  dialogFormVisible.value = true
  Object.assign(form, emptyForm)
  // for (const i in form) {
  //   form[i] = ''
  // }
  // form.id = null
  // form.enabled = true

}
const show = (row: Api) => {
  getById(row.id).then((res) => {
    showApi.value = true
    curApi.value = res.data
  })
}
const edit = (row: Api) => {
  getById(row.id).then((res) => {
    dialogFormVisible.value = true
    Object.assign(form, res.data)
  })
}
const modifyApi = () => {
  modify(form).then(() => {
    dialogFormVisible.value = false
    setTimeout(getList, 200)
  })
}
const createApi = () => {
  create(form).then(() => {
    dialogFormVisible.value = false
    setTimeout(getList, 200)
  })
}
const del = (row: Api) => {
  console.log('del', row);

  deleteApi(row.id).then(() => {
    setTimeout(getList, 200)
  })
}
const refresh = () => {
  reload()
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.btn {
  display: flex;
  align-items: center;
}
</style>