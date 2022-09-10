<template>
  <div class="container">
    <Breadcrumb :items="['工单管理', '流程管理']" />
    <a-card>
      <a-space direction="vertical" fill>
        <!-- 搜索工作栏 -->
        <a-form :model="queryParams" ref="queryForm" v-show="showSearch" style="border-bottom: 1px solid var(--color-border-2)">
          <a-form-item label-col-flex="80px" label="流程标识" field="key" style="width: 320px">
            <a-input v-model="queryParams.key" placeholder="请输入流程标识" allow-clear @keyup.enter="handleQuery" />
          </a-form-item>
          <a-form-item label-col-flex="80px" label="流程名称" field="name" style="width: 320px">
            <a-input v-model="queryParams.name" placeholder="请输入流程名称" allow-clear @keyup.enter="handleQuery" />
          </a-form-item>
          <a-form-item label-col-flex="80px">
            <a-space>
              <a-button type="primary" @click="handleQuery">搜索</a-button>
              <a-button @click="resetQuery">重置</a-button>
            </a-space>
          </a-form-item>
        </a-form>
        <!-- 操作工具栏 -->
        <a-row :gutter="10" class="options" justify="space-between">
          <a-col :span="6"></a-col>
          <a-col :span="6" style="text-align: right">
            <a-button type="primary" @click="handleAdd">新建流程</a-button>
          </a-col>
          <!-- <a-col :span="1.5">
            <a-button type="info" icon="a-icon-upload2" size="mini" @click="handleImport"
                      v-hasPermi="['bpm:model:import']">导入流程</a-button>
          </a-col> -->
          <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
        </a-row>

        <a-spin :loading="loading" style="width: 100%">
          <!-- 列表 -->
          <a-table :data="list" :columns="columns">
            <template #name="{ record }">
              <a-tooltip v-if="record.description" :content="record.description" placement="bottom" effect="light">
                <a-button type="text" @click="handleBpmnDetail(record)">
                  <span>{{ record.name }}</span>
                </a-button>
              </a-tooltip>
              <a-button v-else type="text" @click="handleBpmnDetail(record)">
                <span>{{ record.name }}</span>
              </a-button>
            </template>
            <template #options="{ record }">
              <a-button size="mini" type="text" @click="handleDesign(record)">设计流程</a-button>
              <a-button size="mini" type="text" @click="handleView(record)">详情</a-button>
              <a-button size="mini" type="text" @click="handleDelete(record)">删除</a-button>
            </template>
          </a-table>
        </a-spin>
      </a-space>

      <a-modal v-model:visible="showBpmnOpen" title="流程图" title-align="start" width="1200px" @before-ok="showBpmnOpen = false">
        <MyProcessViewer key="designer" v-model="bpmnXML" v-bind="bpmnControlForm" />
      </a-modal>

      <a-modal v-model:visible="open" :title="title" title-align="start" width="600px" @before-ok="submitForm">
        <a-form :model="form" ref="refForm">
          <a-form-item label="流程标识" field="key" :rules="[{ required: true, message: '流程标识不能为空' }]">
            <a-input v-model="form.key" placeholder="请输入流标标识" />
            <a-tooltip class="item" content="新建后，流程标识不可修改！" position="top">
              <icon-question-circle />
            </a-tooltip>
          </a-form-item>
          <a-form-item label="流程名称" field="name" :rules="[{ required: true, message: '流程名称不能为空' }]">
            <a-input v-model="form.name" placeholder="请输入流程名称" allow-clear />
          </a-form-item>
          <a-form-item label="流程描述" field="description">
            <a-input type="textarea" v-model="form.description" allow-clear />
          </a-form-item>
          <a-form-item label="是否周期性流程">
            <a-radio-group v-model="isCron">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="每天" v-if="isCron" field="cronTerm" :rules="[{ required: true, message: '开始时间不能为空' }]">
            <a-time-picker placeholder="起始时间" v-model="form.cronTerm" format="HH:mm" disable-confirm> </a-time-picker>
          </a-form-item>
          <a-form-item label="工单名称" v-if="isCron" field="cronName" :rules="[{ required: true, message: '工单名称不能为空' }]">
            <a-input v-model="form.cronName" placeholder="请输入工单名称" allow-clear />
          </a-form-item>
          <a-form-item label="工单描述" v-if="isCron" field="content">
            <a-input type="textarea" v-model="form.content" allow-clear />
          </a-form-item>
          <a-form-item label="服务归属" v-if="isCron" field="ascription" :rules="[{ required: true, message: '服务归属不能为空' }]">
            <a-input type="textarea" v-model="form.ascription" allow-clear />
          </a-form-item>
          <a-form-item label="任务地点" v-if="isCron" field="address" :rules="[{ required: true, message: '任务地点不能为空' }]">
            <a-input type="textarea" v-model="form.address" allow-clear />
          </a-form-item>
          <a-form-item label="处理人" v-if="isCron" field="currentProcessor" :rules="[{ required: true, message: '处理人不能为空' }]">
            <a-input type="textarea" v-model="form.currentProcessor" allow-clear />
          </a-form-item>
          <a-form-item label="审核人" v-if="isCron" field="approve" :rules="[{ required: true, message: '审核人不能为空' }]">
            <a-input type="textarea" v-model="form.approve" allow-clear />
          </a-form-item>
          <a-form-item label="预计收入" v-if="isCron" field="income">
            <a-input type="textarea" v-model="form.income" allow-clear />
          </a-form-item>
        </a-form>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div> -->
      </a-modal>

      <a-modal v-model:visible="viewopen" title="详情" title-align="start" width="600px">
        <a-form :model="viewData" v-if="viewopen">
          <a-form-item label="流程标识" field="key">
            {{ viewData.key }}
          </a-form-item>
          <a-form-item label="流程名称" field="name">
            {{ viewData.name }}
          </a-form-item>
          <a-form-item label="流程描述" field="description">
            {{ viewData.description }}
          </a-form-item>
          <a-form-item label="是否周期性流程" v-if="viewData.cronDesc">
            {{ viewData.cronDesc.type === 1 ? "是" : "否" }}
          </a-form-item>
          <a-form-item label="每天" v-if="viewData.cronDesc.type === 1" field="cronTerm">
            {{ viewData.cronTerm }}
          </a-form-item>
          <a-form-item label="工单名称" v-if="viewData.cronDesc.type === 1" field="cronName">
            {{ viewData.cronDesc.name }}
          </a-form-item>
          <a-form-item label="工单描述" v-if="viewData.cronDesc.type === 1" field="content">
            {{ viewData.cronDesc.content }}
          </a-form-item>
          <a-form-item label="服务归属" v-if="viewData.cronDesc.type === 1" field="ascription">
            {{ viewData.cronDesc.ascription }}
          </a-form-item>
          <a-form-item label="任务地点" v-if="viewData.cronDesc.type === 1" field="address">
            {{ viewData.cronDesc.address }}
          </a-form-item>
          <a-form-item label="处理人" v-if="viewData.cronDesc.type === 1" field="currentProcessor">
            {{ viewData.cronDesc.currentProcessor }}
          </a-form-item>
          <a-form-item label="审核人" v-if="viewData.cronDesc.type === 1" field="approve">
            {{ viewData.cronDesc.approve }}
          </a-form-item>
          <a-form-item label="预计收入" v-if="viewData.cronDesc.type === 1" field="income">
            {{ viewData.cronDesc.income }}
          </a-form-item>
        </a-form>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div> -->
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts">
import BpmModel from "@/api/ticket/model";
import { defineComponent, onMounted, reactive, ref } from "vue";
import modal from "@arco-design/web-vue/es/modal";
import Message from "@/utils/Message";
import Breadcrumb from "@/components/Breadcrumb.vue";
import MyProcessViewer from "@/components/bpmnProcessDesigner/package/designer/ProcessViewer.vue";
import { useRouter } from "vue-router";
import moment from "moment";

interface FormData {
  key: string | undefined;
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  cronTerm: string | undefined;
  cronName: string | undefined;
  content: string | undefined;
  ascription: string | undefined;
  address: string | undefined;
  currentProcessor: string | undefined;
  approve: string | undefined;
  income: string | undefined;
  cronDesc: string | undefined;
  bpmKey: string | undefined;
}

export default defineComponent({
  name: "ProcessList",
  components: {
    Breadcrumb,
    MyProcessViewer,
  },
  setup() {
    const loading = ref(true);
    const showSearch = ref(true);
    const queryParams = reactive({
      pageNo: 1,
      pageSize: 10,
      total: 0,
      key: "",
      name: "",
    });

    const showBpmnOpen = ref(false);
    const bpmnXML = ref(null);
    const bpmnControlForm = reactive({
      prefix: "activiti",
    });

    const title = ref("");
    const open = ref(false);
    const viewopen = ref(false);
    const refForm = ref();
    const form = reactive<FormData>({
      key: "",
      id: "",
      name: "",
      description: "",
      cronTerm: "",
      cronName: "",
      content: "",
      ascription: "",
      address: "",
      currentProcessor: "",
      approve: "",
      income: "",
      cronDesc: "",
      bpmKey: "",
    });

    const isCron = ref(false);
    // watch(isCron, () => {
    // })
    const cronForm = reactive({});
    const list = ref([]);
    const columns = [
      {
        title: "编号",
        dataIndex: "id",
      },
      {
        title: "流程标识",
        dataIndex: "key",
      },
      {
        title: "流程名称",
        dataIndex: "name",
        slotName: "name",
      },
      {
        title: "创建时间",
        dataIndex: "createTime",
      },
      {
        title: "操作",
        slotName: "options",
      },
    ];

    const reset = () => {
      form.id = "";
      form.key = "";
      form.name = "";
      form.description = "";
      form.cronName = "";
      form.content = "";
      form.ascription = "";
      form.address = "";
      form.currentProcessor = "";
      form.approve = "";
      form.income = "";
      form.cronTerm = "";
      isCron.value = false;
      // this.resetForm("form");
    };

    /** 取消按钮 */
    const cancel = () => {
      open.value = false;
      reset();
    };

    /** 搜索按钮操作 */
    const handleQuery = () => {
      queryParams.pageNo = 1;
      getList();
    };

    /** 重置按钮操作 */
    const resetQuery = () => {
      // this.resetForm("queryForm");
      handleQuery();
    };

    /** 新增按钮操作 */
    const handleAdd = () => {
      reset();
      title.value = "新建模型";
      open.value = true;
    };

    const viewData = ref<any>({});
    const handleView = (record: any) => {
      console.log("record", record);
      viewopen.value = true;
      viewData.value = record;
    };

    const router = useRouter();
    /** 设计按钮操作 */
    const handleDesign = (row: any) => {
      console.log("row", row);
      router.push({
        name: "ProcessManagement/Editor",
        params: {
          modelId: row.id,
        },
      });
    };

    /** 删除按钮操作 */
    const handleDelete = (row: any) => {
      modal.warning({
        title: "提示",
        content: "是否删除该流程?",
        closable: true,
        cancelText: "取消",
        hideCancel: false,
        onOk: () => {
          BpmModel.deleteModel(row.id).then(() => {
            getList();
            Message.success("删除成功");
          });
        },
      });
    };
    /** 流程图的详情按钮操作 */
    const handleBpmnDetail = (row: any) => {
      BpmModel.getModel(row.id).then((response) => {
        bpmnXML.value = response.data.bpmnXml;
        // 弹窗打开
        showBpmnOpen.value = true;
      });
    };

    /** 提交按钮 */
    const submitForm = (done: any) => {
      refForm.value.validate().then((data: any) => {
        console.log("data", data);
        if (data === undefined) {
          if (!isCron.value) {
            form.cronTerm = undefined;
            form.cronName = undefined;
            form.content = undefined;
            form.ascription = undefined;
            form.address = undefined;
            form.currentProcessor = undefined;
            form.approve = undefined;
            form.income = undefined;
          }
          form.key = form.key || undefined;
          form.bpmKey = form.key || undefined;
          form.id = form.id || undefined;
          form.name = form.name || undefined;
          form.description = form.description || undefined;
          form.cronTerm = form.cronTerm || undefined;
          form.cronName = form.cronName || undefined;
          form.content = form.content || undefined;
          form.ascription = form.ascription || undefined;
          form.address = form.address || undefined;
          form.currentProcessor = form.currentProcessor || undefined;
          form.approve = form.approve || undefined;
          form.income = form.income || undefined;
          form.cronDesc = JSON.stringify({
            type: isCron.value ? 1 : 2,
            bpmKey: form.bpmKey,
            name: form.name,
            content: form.content,
            ascription: form.ascription,
            address: form.address,
            currentProcessor: form.currentProcessor,
            currentProcessorId: "113",
            approve: form.approve,
            income: form.income,
          });
          // 创建
          BpmModel.createModel(form)
            .then(() => {
              done(true);
              getList();
              modal.warning({
                title: "提示",
                content: "新建模型成功！后续需要执行如下个步骤：点击【设计流程】按钮，绘制流程图。",
                closable: true,
              });
            })
            .catch(() => {
              done(false);
            });
        } else {
          done(false);
        }
      });
    };
    const getList = () => {
      loading.value = true;
      BpmModel.getModelPage(queryParams).then((response: any) => {
        list.value = response.data.list.map((item: any) => {
          return {
            ...item,
            cronDesc: item.cronDesc && JSON.parse(item.cronDesc),
            createTime: moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          };
        });
        queryParams.total = response.data.total;
        loading.value = false;
      });
    };
    onMounted(() => {
      getList();
    });
    return {
      list,
      loading,
      showSearch,
      queryParams,
      showBpmnOpen,
      bpmnXML,
      bpmnControlForm,
      title,
      open,
      viewopen,
      form,
      isCron,
      cronForm,
      columns,
      refForm,
      viewData,
      handleView,
      cancel,
      handleQuery,
      resetQuery,
      handleAdd,
      handleDesign,
      handleDelete,
      handleBpmnDetail,
      submitForm,
    };
  },
});
</script>

<style lang="less" scoped>
.my-process-designer {
  height: 900px;
}
</style>
